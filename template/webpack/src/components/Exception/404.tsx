import { getRedirectPath } from '@/access'
import { Button, Result } from 'antd'
import React from 'react'
import { useHistory } from 'react-router-dom'

export default () => {
  // 路由实例
  const history = useHistory()

  return (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，您访问的页面不存在。"
      extra={
        <Button type="primary" onClick={() => history.push(getRedirectPath())}>
          返回首页
        </Button>
      }
    />
  )
}
