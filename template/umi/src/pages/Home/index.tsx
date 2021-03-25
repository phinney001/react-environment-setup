import { DynamicFormItem } from '@/components/DynamicForm'
import IntegrationTable, { IntegrationTableProps } from '@/components/IntegrationTable'
import { loadStausList } from '@/utils/dict'
import { ProColumns } from '@ant-design/pro-table'
import { message, Popconfirm } from 'antd'
import React, { useEffect, useState } from 'react'
import { changeUserStatus } from './service'

const Home: React.FC<any> = () => {
  // 组件是否已经卸载
  let isUnMounted = false
  // 状态列表
  const [statusList, setStatusList] = useState<any>({})

  // 表格项
  const columns: ProColumns[] = [
    {
      title: '用户名',
      dataIndex: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '注册时间',
      dataIndex: 'addTime',
      hideInSearch: true,
    },
    {
      title: '是否启用',
      dataIndex: 'status',
      hideInSearch: true,
      valueEumn: statusList
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 70,
      render: (_: any, record: any) => {
        const stateText = record.deleted === 1 ? '启用' : '冻结'
        const popProps: any = {
          title: `确定要${stateText}此用户?`,
          placement: 'topRight',
          onConfirm: async () => {
            const res = await changeUserStatus({})
            if (res) {
              message.success(`${stateText}成功！`)
            }
          },
        }
        return (
          <Popconfirm {...popProps}>
            <a>{stateText}</a>
          </Popconfirm>
        )
      }
    }
  ]
  // 表单项
  const formItems: DynamicFormItem[] = [
    {
      type: 'text',
      label: '用户名',
      name: 'name',
      required: true,
    },
    {
      type: 'phone',
      label: '联系方式',
      name: 'phone',
      required: true,
    },
  ]

  // 一体化表格props
  const tablePorps: IntegrationTableProps = {
    headerTitle: '用户列表',
    rowKey: 'id',
    columns,
    formItems,
    listProps: {
      url: '/admin/enterprise/listEnterprise',
    },
    addProps: {
      url: '/admin/enterprise/saveEnterprise',
    },
  }

  // 初始化加载数据
  useEffect(() => {
    loadStausList((list: any[]) => {
      !isUnMounted && setStatusList(list)
    })
    return () => {
      isUnMounted = true
    }
  }, [])

  return (
    <IntegrationTable {...tablePorps} />
  )
}

export default Home