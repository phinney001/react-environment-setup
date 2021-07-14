import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Layout, Menu, Breadcrumb, Dropdown, message } from 'antd'
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import config from '../config'
import Avatar from 'antd/lib/avatar/avatar'
import { access, getRedirectPath, getUserName, loginPath, toLogin } from '@/access'
import { RouteProps } from '@/routes'
import { getObject, isNotEmptyArray } from 'phinney-toolkit'
import { Link, useHistory } from 'react-router-dom'
import { useStore } from '@/hooks'
import styles from './index.module.less'
import DynamicForm, { DynamicFormItem } from '@/components/DynamicForm'
import { changePassword } from '@/pages/Login/service'
import { CONFIG } from '@/store/action'
import { modal } from '@/components/CustomModal'
import { EventEmitter } from 'events'

export const event = new EventEmitter()
const { Header, Content, Footer, Sider } = Layout
const { SubMenu } = Menu

// 侧边栏收起/展开事件名称
export const COLLAPSED_EVENT_NAME = 'COLLAPSED_TOGGLE'

export default (props: any) => {
  const { children, routes } = props || {}
  // 菜单收起
  const [collapsed, setCollapsed] = useState(false)
  // 路由实例
  const history = useHistory()
  // 公共存储
  const { state } = useStore(CONFIG)
  // 面包屑
  const { breadcrumb, title } = getObject(state)
  // 修改密码表单实例
  let passwordForm: any = useRef()

  // 设置全局history
  if (!window.router) {
    window.router = history
  }

  // 退出登录
  const loginOut = () => {
    // 判断当前是否是登录页
    if (window.location.pathname !== loginPath) {
      message.success('退出成功！')
      toLogin()
    }
  }

  // 下拉项点击事件
  const onMenuClick = useCallback(({ key } = {}) => {
    if (key === 'logout') {
      loginOut()
      return
    }
    if (key === 'modify') {
      const formItems: DynamicFormItem[] = [
        {
          type: 'password',
          name: 'prePassword',
          label: '原密码',
          required: true,
        },
        {
          type: 'password',
          name: 'updatePassword',
          label: '新密码',
          required: true,
        },
      ]
      modal({
        title: '修改密码',
        content: () => (
          <div style={{ padding: '0 30px' }}>
            <DynamicForm ref={(ref: any) => (passwordForm = ref)} formItems={formItems} />
          </div>
        ),
        onOk: async () => {
          if (passwordForm?.form) {
            try {
              const values = await passwordForm.form.validateFields()
              const res = await changePassword(values)
              if (res) {
                message.success('修改成功！')
                return true
              }
            } catch {}
          }
          return false
        },
      })
    }
  }, [])

  // 下拉菜单
  const AvatarMenu = (
    <Menu className={styles.pageDropdownMenu} onClick={onMenuClick}>
      <Menu.Item key="modify">
        <SettingOutlined />
        修改密码
      </Menu.Item>
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  )

  // 页面菜单
  const handleMenu = (params: RouteProps[]) => {
    return (
      params.map((item) => {
        // 不需要展示的菜单
        if (item?.layout === 'passport' || item?.hideInMenu) {
          return null
        }
        return (
          access(item) ? (
            isNotEmptyArray(item?.routes)
              ?
              <SubMenu
                key={item?.path}
                icon={item.icon}
                title={item.name}
              >
                {handleMenu(item.routes)}
              </SubMenu>
              :
              <Menu.Item
                key={item?.path}
                icon={item.icon}>{item.name}</Menu.Item>
          ) : null
        )
      })
    )
  }

  // 面包屑
  const handleBreadcrumb = (params: any[]) => {
    return (
      <>
        <Breadcrumb.Item>
          <Link to={getRedirectPath()}>首页</Link>
        </Breadcrumb.Item>
        {
          params?.map?.((item: any) => (
            <Breadcrumb.Item key={item.path}>
              <Link to={item.path}>{item.name}</Link>
            </Breadcrumb.Item>
          ))
        }
      </>
    )
  }

  // 获取默认展开菜单key
  const getDefaultOpenKeys = () => {
    const urlList = history.location.pathname.split('/').filter(Boolean)

    return urlList.splice(0, urlList.length - 1).map(x => `/${x}`)
  }

  // 侧边栏展开收起监听
  useEffect(() => {
    event.emit(COLLAPSED_EVENT_NAME, collapsed)
  }, [collapsed])

  return (
    <Layout className={styles.pageLayout}>
      {/* 侧边栏 */}
      <Sider
        className={styles.pageSider}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        {/* 图标 */}
        <Link to="/" className={styles.pageLogo}>
          <img src={config.logoShort} alt="图标" />
          {!collapsed && <h1>{config.titleShort}</h1>}
        </Link>
        {/* 菜单 */}
        <Menu
          theme="dark"
          mode="inline"
          className={styles.pageMenu}
          defaultOpenKeys={getDefaultOpenKeys()}
          selectedKeys={[history.location.pathname]}
          onClick={({ key }: any) => {
            history.replace(key)
          }}
        >
          {handleMenu(routes)}
        </Menu>
      </Sider>
      <Layout>
        {/* 页头 */}
        <Header className={styles.pageHeader}>
          <div className={styles.pageHeaderMain}>
            <div className={styles.pageHeaderLeft}></div>
            <div className={styles.pageHeaderRight}>
              {/* 用户信息 */}
              <Dropdown overlay={AvatarMenu}>
                <div className={styles.pageUserInfo}>
                  <Avatar
                    size='small'
                    className={styles.pageAvatar}
                    src={config.avatar}
                    alt="头像"
                  />
                  {/* 用户名 */}
                  <strong className={styles.pageUserName}>
                    {getUserName()}
                  </strong>
                </div>
              </Dropdown>
            </div>
          </div>
          {/* 面包屑 */}
          <Breadcrumb className={styles.pageBreadcrumb}>
            {handleBreadcrumb(breadcrumb)}
          </Breadcrumb>
          {/* 页面标题 */}
          <h2 className={styles.pageTitle}>{title}</h2>
        </Header>
        <Content className={styles.pageContent}>
          {children}
        </Content>
        {/* 页脚 */}
        <Footer className={styles.pageFooter}>{config.copyright}</Footer>
      </Layout>
    </Layout>
  )
}
