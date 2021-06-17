import React from 'react'
import ReactDOM from 'react-dom'
import RouteAuth from '@/routes/RouteAuth'
import { StoreProvider } from '@/store'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import 'moment/dist/locale/zh-cn'
import './main.less'

// 生产开启严格模式
const ReactMode = import.meta?.env?.PROD
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
