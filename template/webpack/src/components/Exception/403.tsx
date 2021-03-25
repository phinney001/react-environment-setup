import { getRedirectPath } from '@/access'
import { Button, Result } from 'antd'
import React from 'react'
import { useHistory } from 'react-router-dom'

export default () => {
  // 路由实例
  const history = useHistory()

  return (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，您没有访问权限。"
      extra={
        <Button type="primary" onClick={() => history.push(getRedirectPath())}>
          返回首页
        </Button>
      }
    />
  )
}
