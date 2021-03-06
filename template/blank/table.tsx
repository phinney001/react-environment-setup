import IntegrationTable, { IntegrationTableProps } from '@/components/IntegrationTable'
import { DynamicFormItem } from '@/components/DynamicForm'
import React, { useEffect } from 'react'
import { TableColumnProps } from 'antd'

// @page HEADERTITLE
const COMPONENT: React.FC = () => {
  // 组件是否已经卸载
  let isUnMounted = false

  // 表格项
  const columns: TableColumnProps<any>[] = [
    {
      title: 'title',
      dataIndex: 'dataIndex',
    },
  ]

  // 过滤表单项
  const filterItems: DynamicFormItem[] = [
    {
      type: 'text',
      label: 'label',
      name: 'name',
    },
  ]
  
  // 新增&编辑表单项
  const formItems: DynamicFormItem[] = [
    {
      type: 'text',
      label: 'label',
      name: 'name',
      required: true,
    },
  ]

  // 一体化表格props
  const tableProps: IntegrationTableProps = {
    rowKey: 'index',
    scroll: { x: 1000 },
    columns,
    formItems,
    filterItems,
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
    <IntegrationTable {...tableProps} />
  )
}

export default COMPONENT
