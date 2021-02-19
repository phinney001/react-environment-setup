import React, { useCallback } from 'react'
import { LogoutOutlined } from '@ant-design/icons'
import { Avatar, Menu, message, Dropdown } from 'antd'
import { getPageQuery } from '@/utils/utils'
import { logout } from '@/services/login'
import { getUserName, loginPath, toLogin } from '@/access'

import styles from './index.less'

// 退出登录，并且将当前的 url 保存
const loginOut = async () => {
  // await logout()
  const { redirect } = getPageQuery()
  // 判断当前是否是登录页
  if (window.location.pathname !== loginPath && !redirect) {
    message.success('退出成功！')
    toLogin()
  }
}

const HeaderAvatar: React.FC<any> = () => {
  // 下拉项点击事件
  const onMenuClick = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event
      if (key === 'logout') {
        loginOut()
        return
      }
    },
    [],
  )

  // 下拉菜单
  const AvatarMenu = (
    <Menu className={styles.headerMenu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlayClassName={styles.headerDropdown} overlay={AvatarMenu}>
      <span className={`${styles.headerAction} ${styles.headerAccount}`}>
        <Avatar
          size='small'
          className={styles.headerAvatar}
          src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
          alt="avatar"
        />
        <span className={`${styles.headerName} anticon`}>{getUserName()}</span>
      </span>
    </Dropdown>
  );
};

export default HeaderAvatar
