import { history } from 'umi'
import { BasicLayoutProps, MenuDataItem } from '@ant-design/pro-layout'
import CustomModal, { modal } from '@/components/CustomModal'
import { getUserName, isLogin, loginPath, toLogin } from '@/access'
import { EventEmitter } from 'events'
import { Dropdown, Menu, message, Avatar, Layout } from 'antd'
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { useCallback, useRef } from 'react'
import DynamicForm, { DynamicFormItem } from '@/components/DynamicForm'
import styles from './index.less'
import { changePassword } from '@/pages/Passport/Login/service'
import config from '../config'

// 侧边栏收起/展开事件名称
export const COLLAPSED_EVENT_NAME = 'COLLAPSED_TOGGLE'
export const event = new EventEmitter()

const { Footer } = Layout

// 用户信息
const UserInfo = () => {
  // 修改密码表单实例
  let passwordForm: any = useRef()

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

  return (
    <Dropdown overlay={AvatarMenu}>
      <div className={styles.pageUserInfo}>
        <Avatar size="small" className={styles.pageAvatar} src={config.avatar} alt="头像" />
        {/* 用户名 */}
        <strong className={styles.pageUserName}>{getUserName()}</strong>
      </div>
    </Dropdown>
  )
}

export default (): BasicLayoutProps => {
  // 处理菜单数据
  const recursion = (menuList: any[]): any => {
    return menuList?.map((item: any) => ({
      path: item?.path,
      name: item?.name,
      icon: item?.icon,
      children: recursion(item?.children),
    }))
  }

  return {
    // 侧边栏展开收起监听
    onCollapse: (collapsed) => {
      event.emit(COLLAPSED_EVENT_NAME, collapsed)
    },
    // 顶部右侧用户信息
    rightContentRender: () => (
      <>
        {/* 用户信息 */}
        <UserInfo />
        <CustomModal />
      </>
    ),
    // 是否禁止主要区域margin
    disableContentMargin: false,
    // 页面跳转事件
    onPageChange: () => {
      // 如果没有登录，重定向到 login
      if (!isLogin() && history.location.pathname !== loginPath) {
        toLogin()
      }
    },
    // 菜单数据渲染
    menuDataRender: (menuList: MenuDataItem[]) => {
      const allUserMenu = menuList?.find((f) => f.path === '/')?.children || []
      return recursion(allUserMenu)
      // return getMenus()
    },
    // 面包屑配置
    breadcrumbRender: (routers: any) => {
      return [{ path: '/', breadcrumbName: '首页' }, ...routers]
    },
    // 水印配置
    waterMarkProps: {
      content: config.waterMark,
      gapX: 200,
      gapY: 100,
    },
    // 页脚
    footerRender: () => <Footer className={styles.pageFooter}>{config.copyright}</Footer>,
  }
}
