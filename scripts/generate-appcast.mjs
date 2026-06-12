import { readdir, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const assetsDir = process.argv[2] ?? 'release-assets'
const repository = process.env.GITHUB_REPOSITORY
const tag = process.env.GITHUB_REF_NAME

if (!repository) {
  throw new Error('GITHUB_REPOSITORY is required')
}

if (!tag) {
  throw new Error('GITHUB_REF_NAME is required')
}

const version = tag.replace(/^v/i, '')
const releaseURL = `https://github.com/${repository}/releases/tag/${encodeURIComponent(tag)}`
const downloadBaseURL = `https://github.com/${repository}/releases/download/${encodeURIComponent(tag)}`

const feeds = [
  {
    file: 'appcast-darwin-arm64.xml',
    asset: 'wails-vue-starter-darwin-arm64.zip',
    os: 'macos',
  },
  {
    file: 'appcast-darwin-amd64.xml',
    asset: 'wails-vue-starter-darwin-amd64.zip',
    os: 'macos',
  },
  {
    file: 'appcast-linux-amd64.xml',
    asset: 'wails-vue-starter-linux-amd64.tar.gz',
    os: 'linux',
  },
  {
    file: 'appcast-windows-amd64.xml',
    asset: 'wails-vue-starter-windows-amd64.zip',
    os: 'windows',
  },
]

const existing = new Set(await readdir(assetsDir))

for (const feed of feeds) {
  if (!existing.has(feed.asset)) {
    throw new Error(`Missing updater asset: ${feed.asset}`)
  }

  const assetPath = join(assetsDir, feed.asset)
  const { size } = await stat(assetPath)
  const assetURL = `${downloadBaseURL}/${encodeURIComponent(feed.asset)}`
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:sparkle="http://www.andymatuschak.org/xml-namespaces/sparkle">
  <channel>
    <title>Wails Vue Starter Updates</title>
    <link>${escapeXML(releaseURL)}</link>
    <description>Wails Vue Starter release feed</description>
    <item>
      <title>${escapeXML(tag)}</title>
      <description><![CDATA[<p>Release notes: <a href="${releaseURL}">${tag}</a></p>]]></description>
      <sparkle:version>${escapeXML(version)}</sparkle:version>
      <sparkle:shortVersionString>${escapeXML(version)}</sparkle:shortVersionString>
      <sparkle:os>${feed.os}</sparkle:os>
      <enclosure url="${escapeXML(assetURL)}" length="${size}" type="application/octet-stream" sparkle:os="${feed.os}"/>
    </item>
  </channel>
</rss>
`

  await writeFile(join(assetsDir, feed.file), xml)
}

function escapeXML(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}
