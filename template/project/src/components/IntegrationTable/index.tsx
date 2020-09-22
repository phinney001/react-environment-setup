import React, { useState, useRef, useEffect, ForwardRefRenderFunction, useImperativeHandle, forwardRef } from 'react'
import ProTable, { ActionType, ProTableProps } from '@ant-design/pro-table'
import { FormProps } from 'antd/lib/form'
import DynamicForm, { DynamicFormItem } from '../DynamicForm'
import { PlusOutlined } from '@ant-design/icons'
import { Button, message, Popconfirm, Divider } from 'antd'
import { PageContainer } from '@ant-design/pro-layout'
import request from '@/utils/request'
import { modal } from '../CustomModal'
import { FormInstance } from 'antd/es/form'
import { ModalProps as MProps } from 'antd/lib/modal'
import { PopconfirmProps } from 'antd/es/popconfirm'

/**
 * 弹窗配置
 * @param width 弹窗宽度
 * @param title 弹窗标题
 * @param formItems 弹窗表单配置列表
 * @param formValuesHandle 弹窗数据处理方法
 * @param openBefore 弹窗打开之前处理方法
 */
export interface ModalProps extends MProps {
  width?: number
  title?: string
  formProps?: FormProps
  formItems?: DynamicFormItem[]
  formValuesHandle?: (params: any) => any
  openBefore?: (params?: any) => void
  [key: string]: any
}

/**
 * 请求配置
 * @param url 请求地址
 * @param method 请求方式
 * @param paramsHandle 请求参数处理
 * @param responseHandle 请求结果处理
 * @param requestBefore 请求之前处理方法
 * @param requestAfter 请求之后处理方法
 * @param requestFunc 自定义request方法
 * @param requestType 请求参数类型
 * @param btnText 按钮显示文字
 * @param btnClick 按钮点击事件(仅支持自定义操作项)
 * @param loadingMsg 请求中提示文字
 * @param successMsg 请求成功提示文字
 * @param modalProps 弹窗props
 * @param popProps 删除提示窗props
 */
export interface RequestConfig {
  url?: string
  method?: string
  paramsHandle?: (params: any) => any
  responsesHandle?: (params: any) => any
  requestBefore?: (params?: any) => void
  requestAfter?: (params?: any) => void
  requestFunc?: (url?: string, options?: any) => any
  requestType?: 'params' | 'data'
  btnText?: string
  btnClick?: (record?: any, callback?: () => void) => void
  loadingMsg?: string
  successMsg?: string
  modalProps?: ModalProps
  popProps?: PopconfirmProps
  [key: string]: any
}


/**
 * 操作项配置
 * @param type 按钮类型
 * @param props 按钮请求配置
 */
export interface OperatingItem {
  type: 'pop' | 'modal' | 'custom' | string
  props?: RequestConfig | undefined
}

/**
 * 一体化表格refs接口
 * @param filterform 搜索表单实例
 * @param modalform 弹窗表单实例
 * @param actionRef 表格实例
 */
export interface IntegrationTableRefs {
  filterform?: FormInstance
  modalform?: FormInstance
  actionRef?: ActionType
}

/**
 * 一体化表格props接口
 * @param listProps 列表数据配置
 * @param addProps 添加数据配置
 * @param updateProps 更新数据配置
 * @param deleteProps 删除数据配置
 * @param handleOperating 处理/新增操作项
 * @param formItems 新增/编辑弹窗表单配置列表
 * @param isInModal 表格是否嵌套在弹窗中
 */
export interface IntegrationTableProps extends ProTableProps<any, any> {
  listProps?: RequestConfig
  addProps?: RequestConfig
  updateProps?: RequestConfig
  deleteProps?: RequestConfig
  handleOperating?: (data: OperatingItem[]) => OperatingItem[]
  formItems?: DynamicFormItem[]
  isInModal?: boolean
  [key: string]: any
}

const IntegrationTable: ForwardRefRenderFunction<
  IntegrationTableRefs,
  IntegrationTableProps
> = (props, ref) => {
  let {
    listProps,
    addProps,
    updateProps,
    deleteProps,
    handleOperating,
    formItems,
    isInModal,
    ...otherProps
  } = props

  // 组件是否已经卸载
  let isUnMounted = false
  // 弹窗表单数据
  const [formValues, setFormValues] = useState<any>()
  // 弹窗表单类型
  const [formType, setFormType] = useState<any>()
  // 过滤表单实例
  const filterForm: any = useRef()
  // 弹窗动态表单实例
  let modalForm: any = useRef()
  // 表格实例
  const actionRef: any = useRef<ActionType>()
  // 表格props
  const tableProps = otherProps || {}
  const { rowKey, columns, headerTitle } = tableProps

  // 删除含有冲突的表单字段
  if (Reflect.has(tableProps, 'actionRef')) {
    Reflect.deleteProperty(tableProps, 'actionRef')
  }
  if (Reflect.has(tableProps, 'formRef')) {
    Reflect.deleteProperty(tableProps, 'formRef')
  }
  // 分页参数默认值
  if (!Reflect.has(tableProps, 'pagination')) {
    tableProps.pagination = {
      size: 'default',
      showQuickJumper: true,
    }
  }

  // 暴露给父组件数据
  useImperativeHandle(ref, () => ({
    filterForm: filterForm?.current,
    modalForm: modalForm?.current,
    actionRef: actionRef?.current,
  }))

  // 请求处理
  const handleRequest = async (requestProps: RequestConfig = {}, data?: any) => {
    const { url, method, requestBefore, requestAfter, paramsHandle, responseHandle } = requestProps
    // 请求之前处理方法
    await requestBefore?.()
    // 请求参数处理
    const params = paramsHandle ? await paramsHandle?.(data) : data
    if (!requestProps.requestType) requestProps.requestType = 'data'
    const requestFunc = requestProps?.requestFunc || request
    const res = await requestFunc(url || '', {
      method,
      [requestProps.requestType]: params
    })
    // 请求之后处理方法
    await requestAfter?.()
    // 请求结果处理
    const result = responseHandle ? await responseHandle?.(res) : res
    return result
  }

  // 获取弹窗标题
  const getModalTitle = (requestProps?: RequestConfig, prefixText: string = '') => {
    if (requestProps?.modalProps?.title) return requestProps?.modalProps?.title
    const title = (typeof headerTitle === 'string' && headerTitle?.replace('管理', '').replace('列表', '')) || ''
    return prefixText + title
  }

  // 打开表单弹窗
  const openModal = async (requestProps?: RequestConfig) => {
    const modalProps = requestProps?.modalProps
    // 弹窗打开之前调用
    await modalProps?.openBefore?.()
    const values = await modalProps?.formValuesHandle?.(formValues) || formValues
    // 动态表单元素
    const modalFormItems = modalProps?.formItems
    let modalFormContent: React.ReactNode
    if (modalFormItems) {
      modalFormContent = (
        <DynamicForm
          ref={(ref: any) => modalForm = ref}
          formValues={values}
          formProps={modalProps?.formProps}
          formItems={modalFormItems}
        />
      )
    }
    // 打开弹窗
    modal({
      onOk: async () => {
        // 如果有表单发起请求
        if (modalForm?.form) {
          try {
            const values = await modalForm.form?.validateFields?.()
            const hide = message.loading(requestProps?.loadingMsg)
            const res = await handleRequest(requestProps, {
              ...values,
              ...((typeof rowKey === 'string' && formValues[rowKey])
                ? {[rowKey]: formValues[rowKey]}
                : {}
              )
            })
            if (res) {
              hide()
              actionRef?.current?.reload()
              message.success(requestProps?.successMsg)
              return true
            }
            hide()
          } catch { }
          return false
        }
        return true
      },
      onCancel: () => {
        if (!isUnMounted) {
          setFormType(null)
          setFormValues(null)
        }
      },
      bodyStyle: { padding: '32px 40px 48px' },
      ...modalProps,
      ...(modalFormItems ? { formItems: modalFormItems } : {}),
      content: () => {
        return typeof modalProps?.content === 'function'
          ? modalProps?.content(modalFormContent, formValues)
          : (modalProps?.content || modalFormContent)
      },
    })
  }

  // 是否有新增操作
  if (addProps) {
    const toolBarRender: any = tableProps.toolBarRender
    const modalFormItems = addProps?.modalProps?.formItems || formItems
    addProps = {
      method: 'POST',
      btnText: '新建',
      loadingMsg: '正在新增',
      successMsg: '新增成功！',
      requestType: 'data',
      ...addProps,
      modalProps: {
        ...addProps?.modalProps,
        ...(modalFormItems ? { formItems: modalFormItems } : {}),
        title: getModalTitle(addProps, '新增')
      }
    }
    const addButton = (
      <Button
        type="primary"
        onClick={() => {
          if (!isUnMounted) {
            setFormValues({})
            setFormType('add')
          }
        }}
      >
        <PlusOutlined /> {addProps.btnText}
      </Button>
    )
    tableProps.toolBarRender = () => [
      ...(toolBarRender ? toolBarRender?.(addButton) : [addButton])
    ]
  }

  // 是否有更新操作
  if (updateProps) {
    const modalFormItems = addProps?.modalProps?.formItems || formItems
    updateProps = {
      method: 'PUT',
      btnText: '编辑',
      loadingMsg: '正在更新',
      successMsg: '更新成功！',
      requestType: 'data',
      ...updateProps,
      modalProps: {
        ...updateProps?.modalProps,
        ...(modalFormItems ? { formItems: modalFormItems } : {}),
        title: getModalTitle(addProps, '更新')
      }
    }
  }

  // 是否有删除操作
  if (deleteProps) {
    deleteProps = {
      method: 'DELETE',
      btnText: '删除',
      loadingMsg: '正在删除',
      successMsg: '删除成功！',
      requestType: 'data',
      ...deleteProps,
      popProps: {
        title: '确定删除此条记录?',
        placement: 'topRight',
        onConfirm: async (record: any) => {
          try {
            const hide = message.loading(deleteProps?.loadingMsg)
            const res = await handleRequest(deleteProps, {
              ...((typeof rowKey === 'string' && record[rowKey])
                ? { [rowKey]: record[rowKey] }
                : {}
              )
            })
            if (res) {
              actionRef?.current?.reload()
              message.success(deleteProps?.successMsg)
            }
            hide()
          } catch { }
        },
        ...deleteProps?.popProps
      }
    }
  }

  // 是否有列表请求
  if (listProps) {
    listProps = {
      method: 'GET',
      requestType: 'params',
      ...listProps,
    }
    tableProps.request = async (params: any = {}) => {
      const { pageSize, current, ...other } = params

      const res = await handleRequest(listProps, {
        page: current,
        size: pageSize,
        ...other,
      })

      let tableData = res?.records || (res instanceof Array ? res : [])
      // 没有rowKey时自定义成序列号
      if (tableData.length && tableData.every((e: any) => typeof rowKey === 'string' && !e[rowKey])) {
        tableData = tableData.map((item: any, index: number) => ({
          ...item,
          ...(typeof rowKey === 'string'
            ? {[rowKey]: index + 1}
            : {}
          )
        }))
      }

      return {
        data: tableData,
        total: res.total,
        page: current || 0,
        success: true,
      }
    }
  }

  // 操作项列表
  let operatingItems: OperatingItem[] = [
    { type: 'modal', props: updateProps },
    { type: 'pop', props: deleteProps },
  ].filter((f: OperatingItem) => f.props)
  operatingItems = handleOperating?.(operatingItems) || operatingItems
  // 列表是否含有操作项
  const operating = [{
    title: '操作',
    dataIndex: 'option',
    valueType: 'option',
    width: 70 * operatingItems.length,
    render: (_: any, record: any) => {
      return (
        <>
          {
            operatingItems.map((item, index) => {
              let btnElement
              switch (item.type) {
                // 编辑
                case 'modal':
                  btnElement = (
                    <a
                      onClick={() => {
                        if (!isUnMounted) {
                          setFormValues(record)
                          setFormType(item.type + index)
                        }
                      }}
                    >
                      {item?.props?.btnText}
                    </a>
                  )
                  break;
                // 删除
                case 'pop':
                  const onConfirm = item?.props?.popProps?.onConfirm
                  btnElement = (
                    <Popconfirm
                      title=""
                      {...item?.props?.popProps}
                      onConfirm={() => onConfirm?.(record)}
                    >
                      <a>{item?.props?.btnText}</a>
                    </Popconfirm>
                  )
                  break;
                // 自定义
                case 'custom':
                  btnElement = (
                    <a
                      onClick={() => item?.props?.btnClick?.(record)}
                    >
                      {item?.props?.btnText}
                    </a>
                  )
                  break;
                default:
                  break;
              }
              return (
                <span key={index}>
                  {btnElement}
                  {operatingItems[index + 1] && <Divider type="vertical" />}
                </span>
              )
            })
          }
        </>
      )
    },
  }]
  if (operatingItems.length) {
    const newColumns: any = columns instanceof Array ? columns : []
    tableProps.columns = [
      ...newColumns,
      ...operating,
    ]
  }

  // 弹窗数据变动及打开
  useEffect(() => {
    if (formValues && formType) {
      const formTypeMap = {
        'add': addProps,
        ...(operatingItems.reduce((t: any, c: OperatingItem, cIndex) => {
            if (c.type === 'modal') {
              return {
                ...t,
                [c.type + cIndex]: c.props
              }
            }
            return t
          }, {})
        ),
      }
      openModal(formTypeMap[formType])
    }
    return () => {
      isUnMounted = true
    }
  }, [formValues, formType])

  // 渲染表格
  const renderTable = () => (
    <ProTable
      actionRef={actionRef}
      formRef={filterForm}
      {...tableProps}
    />
  )

  return (
    isInModal
      ?
      renderTable()
      :
      <PageContainer>
        {renderTable()}
      </PageContainer>
  )
}

export default forwardRef(IntegrationTable)
