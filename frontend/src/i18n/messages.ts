const en = {
  app: {
    name: 'Wails Vue Starter',
  },
  locale: {
    label: 'Language',
    system: 'System',
    en: 'English',
    zh: '简体中文',
  },
  nav: {
    overview: 'Overview',
    dataUi: 'Data UI',
    nativeRuntime: 'Native Runtime',
    quickCreate: 'New Example',
    inbox: 'Runtime Events',
    resources: 'Resources',
    wailsDocs: 'Wails Docs',
    runtimeDocs: 'Runtime APIs',
    componentDocs: 'shadcn-vue',
    sourceCode: 'Source Code',
    more: 'More',
    open: 'Open',
    share: 'Share',
    delete: 'Delete',
    home: 'Home',
    github: 'GitHub',
    logout: 'Log out',
  },
  welcome: {
    stack: 'Wails3 + Vue 3 + TypeScript',
    title: 'Wails3 Desktop Starter',
    description:
      'A practical example app for Wails3 bindings, runtime APIs, native desktop features, and a modern Vue interface.',
    emptyName: 'Please enter your name below 👇',
    listeningTime: 'Listening for Time event...',
    greet: 'Greet',
    learnMore: 'Click on the Wails logo to learn more',
    wailsLogo: 'Wails logo',
    vueLogo: 'Vue logo',
  },
}

export type MessageSchema = typeof en

export const messages = {
  en,
  zh: {
    app: {
      name: 'Wails Vue Starter',
    },
    locale: {
      label: '语言',
      system: '跟随系统',
      en: 'English',
      zh: '简体中文',
    },
    nav: {
      overview: '项目概览',
      dataUi: '数据界面',
      nativeRuntime: '原生运行时',
      quickCreate: '新建示例',
      inbox: '运行时事件',
      resources: '资源',
      wailsDocs: 'Wails 文档',
      runtimeDocs: '运行时 API',
      componentDocs: 'shadcn-vue',
      sourceCode: '源码仓库',
      more: '更多',
      open: '打开',
      share: '分享',
      delete: '删除',
      home: '首页',
      github: 'GitHub',
      logout: '退出登录',
    },
    welcome: {
      stack: 'Wails3 + Vue 3 + TypeScript',
      title: 'Wails3 桌面应用示例',
      description: '展示 Wails3 绑定、运行时 API、原生桌面能力，以及现代 Vue 界面组织方式。',
      emptyName: '请在下方输入你的名字 👇',
      listeningTime: '正在监听 Time 事件...',
      greet: '问候',
      learnMore: '点击 Wails 标志了解更多',
      wailsLogo: 'Wails 标志',
      vueLogo: 'Vue 标志',
    },
  } satisfies MessageSchema,
}

export type SupportedLocale = keyof typeof messages
