import React, { useEffect } from 'react'

// @page HEADERTITLE
const COMPONENT: React.FC = () => {
  // 组件是否已经卸载
  let isUnMounted = false

  // 初始化加载数据
  useEffect(() => {
    return () => {
      isUnMounted = true
    }
  }, [])

  return (
    <></>
  )
}

export default COMPONENT
