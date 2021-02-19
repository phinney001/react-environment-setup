import React, { useEffect } from 'react'
import { PageContainer } from '@ant-design/pro-layout'

const COMPONENT: React.FC<any> = () => {
  // 组件是否已经卸载
  let isUnMounted = false

  // 初始化加载数据
  useEffect(() => {
    return () => {
      isUnMounted = true
    }
  }, [])

  return (
    <PageContainer></PageContainer>
  )
}

export default COMPONENT
