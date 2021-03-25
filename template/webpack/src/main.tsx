import React from 'react'
import ReactDOM from 'react-dom'
import RouteAuth from '@/routes/RouteAuth'
import { StoreProvider } from '@/store'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN';
import './main.less'

// 生产开启严格模式
const ReactMode = isProduction
  ? React.StrictMode
  : React.Fragment

ReactDOM.render(
  <ReactMode>
    <StoreProvider>
      <ConfigProvider locale={zhCN}>
        <RouteAuth />
      </ConfigProvider>
    </StoreProvider>
  </ReactMode>,
  document.getElementById('root')
)

// 开发模式开启热更新
if (!isProduction) {
  module?.hot?.accept?.()
}
