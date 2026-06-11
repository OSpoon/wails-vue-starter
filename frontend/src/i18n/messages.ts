const en = {
  app: {
    name: 'Wails Vue Starter',
  },
  nav: {
    welcome: 'Welcome',
    dashboard: 'Dashboard',
    foundation: 'Foundation',
    quickCreate: 'Quick Create',
    inbox: 'Inbox',
    documents: 'Documents',
    dataLibrary: 'Data Library',
    more: 'More',
    open: 'Open',
    share: 'Share',
    delete: 'Delete',
    settings: 'Settings',
    home: 'Home',
    github: 'GitHub',
  },
  welcome: {
    stack: 'Wails3 + Vue 3 + TypeScript',
    title: 'Welcome to Wails Vue Starter',
    description:
      'A modern desktop application built with Wails3, Vue 3, TypeScript, and shadcn-vue components.',
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
    nav: {
      welcome: '欢迎',
      dashboard: '仪表盘',
      foundation: '基础能力',
      quickCreate: '快速创建',
      inbox: '收件箱',
      documents: '文档',
      dataLibrary: '数据资料库',
      more: '更多',
      open: '打开',
      share: '分享',
      delete: '删除',
      settings: '设置',
      home: '首页',
      github: 'GitHub',
    },
    welcome: {
      stack: 'Wails3 + Vue 3 + TypeScript',
      title: '欢迎使用 Wails Vue Starter',
      description: '使用 Wails3、Vue 3、TypeScript 和 shadcn-vue 组件构建的现代桌面应用。',
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
