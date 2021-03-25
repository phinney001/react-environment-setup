import React from 'react'
import { loginPath } from '@/access'
import Kanban from '@/pages/Kanban'
import Login from '@/pages/Login'
import {
  DashboardOutlined,
} from '@ant-design/icons'

/**
 * 路由接口
 * @param path 路由路径
 * @param icon 菜单图标
 * @param component 组件
 * @param layout 页面公共布局：未登录|登录后|不设置 默认登录后布局
 * @param routes 子路由列表
 * @param access 是否允许访问
 * @param hideInMenu 是否在菜单内隐藏
 */
 export interface RouteProps {
  path?: string
  icon?: any
  component?: any
  layout?: 'passport' | 'user' | 'none'
  routes?: RouteProps[]
  access?: string
  hideInMenu?: boolean
  [key: string]: any
}

// 路由列表
const routes: RouteProps[] = [
  {
    name: '登录',
    path: loginPath,
    component: Login,
    layout: 'passport',
  },
  {
    name: '看板',
    path: '/kanban',
    icon: <DashboardOutlined />,
    component: Kanban,
  },
]

export default routes