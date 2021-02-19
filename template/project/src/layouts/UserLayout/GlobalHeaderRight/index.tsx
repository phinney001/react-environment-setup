import { Space } from 'antd'
import React from 'react'
import HeaderSearch from './components/HeaderSearch'
import styles from './index.less'
import HeaderNotice from './components/HeaderNotice'
import HeaderAvatar from './components/HeaderAvatar'
import { isLogin } from '@/access'

const GlobalHeaderRight: React.FC<any> = () => {
  if (!isLogin()) {
    return null
  }

  return (
    <Space className={styles.dark}>
      <HeaderSearch
        placeholder="站内搜索"
        defaultValue=""
        options={[]}
        onSearch={value => {
          //console.log('input', value);
        }}
      />
      <HeaderNotice />
      <HeaderAvatar />
    </Space>
  );
};
export default GlobalHeaderRight
