import { modal } from '@/components/CustomModal'
import { DynamicFormItem } from '@/components/DynamicForm'
import FormLocation from '@/components/DynamicForm/FormLocation'
import IntegrationTable, { IntegrationTableProps } from '@/components/IntegrationTable'
import { loadBusinessList, loadIndustryList } from '@/utils/dict'
import { arrayToObject } from 'phinney-toolkit'
import { ProColumns } from '@ant-design/pro-table'
import { message, Popconfirm } from 'antd'
import React, { useEffect, useState } from 'react'
import { changeUserStatus } from './service'

const Home: React.FC<{}> = () => {
  // 组件是否已经卸载
  let isUnMounted = false
  // 行业身份列表
  const [industryList, setIndustryList] = useState<any[]>([])
  // 经营领域列表
  const [businessList, setBusinessList] = useState<any[]>([])

  // 表格项
  const columns: ProColumns[] = [
    {
      title: '行业身份',
      dataIndex: 'industryIdentity',
      hideInTable: true,
      valueEnum: arrayToObject(industryList)
    },
    {
      title: '行业身份',
      dataIndex: 'industryIdentity',
      hideInSearch: true,
    },
    {
      title: '经营领域',
      dataIndex: 'businessArea',
      hideInSearch: true,
    },
    {
      title: '地区',
      dataIndex: 'areaId',
      hideInSearch: true,
    },
    {
      title: '用户名',
      dataIndex: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '地址',
      dataIndex: 'address',
      hideInSearch: true,
      render: (text, record: any) => {
        return (
          <a
            onClick={() => {
              if (!record?.lng || !record?.lat) {
                message.error('该用户没有地址经纬度信息！')
                return
              }
              modal({
                width: 1000,
                title: '地址信息',
                content: <FormLocation  point={record} />,
                footer: null
              })
            }}
          >{text}</a>
        )
      }
    },
    {
      title: '注册时间',
      dataIndex: 'addTime',
      hideInSearch: true,
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
      type: 'select',
      label: '行业身份',
      name: 'industryIdentity',
      required: true,
      options: industryList,
    },
    {
      type: 'select',
      label: '经营领域',
      name: 'businessArea',
      required: true,
      options: businessList,
      fieldProps: {
        mode: 'multiple',
      }
    },
    {
      type: 'location',
      label: '地理位置',
      name: 'address',
      required: true,
    },
    {
      type: 'text',
      label: '用户名称',
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
    loadIndustryList((list: any[]) => {
      !isUnMounted && setIndustryList(list)
    })
    loadBusinessList((list: any[]) => {
      !isUnMounted && setBusinessList(list)
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
