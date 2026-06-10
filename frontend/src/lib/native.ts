import { Browser, Clipboard, Dialogs, Screens, System, Window } from '@wailsio/runtime'

export const nativeBrowser = {
  openURL: (url: string | URL) => Browser.OpenURL(url),
}

export const nativeClipboard = {
  readText: () => Clipboard.Text(),
  writeText: (text: string) => Clipboard.SetText(text),
}

export const nativeDialog = {
  info: Dialogs.Info,
  warning: Dialogs.Warning,
  error: Dialogs.Error,
  question: Dialogs.Question,
  openFile: Dialogs.OpenFile,
  saveFile: Dialogs.SaveFile,
}

export const nativeScreens = Screens
export const nativeSystem = System
export const nativeWindow = Window
