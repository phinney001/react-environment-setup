import IntegrationTable, { IntegrationTableProps } from '@/components/IntegrationTable'
import { DynamicFormItem } from '@/components/DynamicForm'
import { useEffect } from 'react'
import { TableColumnProps } from 'antd'

// @page 看板
const Kanban: React.FC = () => {
  // 组件是否已经卸载
  let isUnMounted = false

  // 表格项
  const columns: TableColumnProps<any>[] = [
    {
      title: '用户名',
      dataIndex: 'user',
      search: true,
    },
  ]

  // 新增&编辑表单项
  const formItems: DynamicFormItem[] = [
    {
      type: 'text',
      label: '用户名',
      name: 'user',
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
    },
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

export default Kanban
