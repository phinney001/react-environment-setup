import React from 'react';
import { history } from 'umi'
import GlobalHeaderRight from './GlobalHeaderRight'

import { BasicLayoutProps, MenuDataItem } from '@ant-design/pro-layout'
import CustomModal from '@/components/CustomModal'
import access, { getMenus, loginPath, toLogin } from '@/access'

export default (): BasicLayoutProps => {
  // 处理菜单数据
  const recursion = (menuList: any[]): any => {
    return menuList?.map((item: any) => ({
      path: item?.path,
      name: item?.name,
      icon: item?.icon,
      children: recursion(item?.children)
    }))
  }

  return {
    // 顶部右侧用户信息
    rightContentRender: () => (
      <>
        <GlobalHeaderRight />
        <CustomModal />
      </>
    ),
    // 是否禁止主要区域margin
    disableContentMargin: false,
    // 页面跳转事件
    onPageChange: () => {
      // 如果没有登录，重定向到 login
      if (!access() && history.location.pathname !== loginPath) {
        toLogin()
      }
    },
    // 菜单数据渲染
    menuDataRender: (menuList: MenuDataItem[]) => {
      const allUserMenu = menuList?.find(f => f.path === '/')?.children || []
      return recursion(allUserMenu)
      // return getMenus()
    },
    // 面包屑渲染
    breadcrumbRender: (routers = []) => [
      { path: '/', breadcrumbName: '首页' },
      ...routers,
    ]
  }
}
