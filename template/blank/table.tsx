import IntegrationTable, { IntegrationTableProps } from '@/components/IntegrationTable'
import { DynamicFormItem } from '@/components/DynamicForm'
import { ProColumns } from '@ant-design/pro-table'
import React, { useEffect } from 'react'

// @page HEADERTITLE
const COMPONENT: React.FC<any> = () => {
  // 组件是否已经卸载
  let isUnMounted = false

  // 表格项
  const columns: ProColumns[] = [
    {
      title: 'title',
      dataIndex: 'dataIndex',
    },
  ]
  // 表单项
  const formItems: DynamicFormItem[] = [
    {
      type: 'text',
      label: 'label',
      name: 'name',
      required: true,
    },
  ]

  // 一体化表格props
  const tablePorps: IntegrationTableProps = {
    rowKey: 'index',
    scroll: { x: 1000 },
    columns,
    formItems,
    listProps: {
      url: '/url',
    }
  }

  // 初始化加载数据
  useEffect(() => {
    return () => {
      isUnMounted = true
    }
  }, [])

  return (
    <IntegrationTable {...tablePorps} />
  )
}

export default COMPONENT
