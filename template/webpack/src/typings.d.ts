declare module '*.css'
declare module '*.less'
declare module '*.svg'

declare interface Window {
  router: any
}

// 是否是生产模式
declare const isProduction: boolean
