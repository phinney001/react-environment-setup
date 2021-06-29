import React, {
  useState,
  useRef,
  useEffect,
  ForwardRefRenderFunction,
  useImperativeHandle,
  forwardRef,
  ReactElement,
  isValidElement,
} from 'react'
import DynamicForm, { DynamicFormItem, locationName } from '../DynamicForm'
import {
  PlusOutlined,
  ReloadOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined
} from '@ant-design/icons'
import {
  Button,
  message,
  Popconfirm,
  Divider,
  FormProps,
  FormInstance,
  PopconfirmProps,
  TableProps,
  Table,
  PaginationProps,
  Card,
  Space,
  Tooltip
} from 'antd'
import request from '@/utils/request'
import {
  getArray,
  getNumber,
  getObject,
  getString,
  isEmptyArray,
  isFunction,
  isNotEmptyArray,
  isNotNullOrUndefined,
  isNumber,
  isString,
  objectMerge,
  sum
} from 'phinney-toolkit'
import { CustomModalProps, modal } from '../CustomModal'
import FilterForm, { FilterFormProps } from '../FilterForm'

/**
 * 弹窗配置
 * @param width 弹窗宽度
 * @param title 弹窗标题
 * @param formProps 弹窗表单props
 * @param formItems 弹窗表单配置列表
 * @param stateHandle 弹窗state处理方法
 * @param formItemsHandle 弹窗表单项处理方法
 * @param formValuesHandle 弹窗数据处理方法
 * @param openBefore 弹窗打开之前处理方法
 */
export interface ModalProps extends CustomModalProps {
  width?: number
  title?: string
  formProps?: FormProps
  formItems?: DynamicFormItem[]
  stateHandle?: (state: any) => Record<string, any>
  formItemsHandle?: (formItems: any, vm: any) => DynamicFormItem[]
  formValuesHandle?: (params: any) => any
  openBefore?: (params: any) => void
  [key: string]: any
}

/**
 * 请求配置
 * @param url 请求地址
 * @param method 请求方式
 * @param urlHandle 请求地址处理
 * @param paramsHandle 请求参数处理
 * @param responseHandle 请求结果处理
 * @param requestBefore 请求之前处理方法
 * @param requestAfter 请求之后处理方法
 * @param requestFunc 自定义request方法
 * @param requestType 请求参数类型
 * @param contentType 请求头类型
 * @param btnText 按钮显示文字
 * @param btnClick 按钮点击事件(仅支持自定义操作项)
 * @param loadingMsg 请求中提示文字
 * @param successMsg 请求成功提示文字
 * @param modalProps 弹窗props
 * @param popProps 删除提示窗props
 * @param aProps a标签props方法
 */
export interface RequestConfig {
  url?: string
  method?: string
  urlHandle?: (params: any, record: any) => any
  paramsHandle?: (params: any, record: any) => any
  responseHandle?: (res: any) => any
  requestBefore?: (params: any, record: any) => void
  requestAfter?: (res: any) => void
  requestFunc?: (url?: string, options?: any) => any
  requestType?: 'params' | 'data'
  contentType?: 'json' | 'form'
  btnText?: string | ((record: any) => string)
  btnClick?: (record?: any, callback?: () => void) => void
  loadingMsg?: string
  successMsg?: string
  modalProps?: ModalProps
  popProps?: PopconfirmProps
  aProps?: (record: any) => any
  [key: string]: any
}

/**
 * 操作项配置
 * @param type 按钮类型
 * @param props 按钮请求配置
 */
export interface OperatingItem {
  type: 'pop' | 'modal' | 'custom' | string
  props?: RequestConfig
}

/**
 * 表格实例接口
 * @param reload 重新加载表格
 * @param setSelected 设置表格行选中项id
 * @param getSelected 获取表格行选中项id
 * @param getSelectedRows 获取表格行选中项
 * @param clearSelected 清空表格行选中项
 * @param reset 清除过滤表单
 */
export interface ActionRefProps {
  reload?: (page?: number) => void
  setSelected?: (keys: any) => void
  getSelected?: () => any[]
  getSelectedRows?: () => any[]
  clearSelected?: () => void
  reset?: () => void
}

/**
 * 一体化表格refs接口
 * @param filterForm 搜索表单实例
 * @param modalForm 弹窗表单实例
 * @param actionRef 表格实例
 */
export interface IntegrationTableRefs {
  filterForm?: FormInstance
  modalForm?: FormInstance
  actionRef?: ActionRefProps
}

/**
 * 一体化表格props接口
 * @param listProps 列表数据配置
 * @param addProps 添加数据配置
 * @param updateProps 更新数据配置
 * @param deleteProps 删除数据配置
 * @param headerTitle 标题&操作按钮
 * @param toolBarRender 表格工具栏
 * @param handleOperating 处理/新增操作项
 * @param formItems 新增/编辑弹窗表单配置列表
 * @param filterItems 过滤表单配置列表
 * @param filterProps 过滤表单props
 */
export interface IntegrationTableProps extends TableProps<any> {
  listProps?: RequestConfig
  addProps?: RequestConfig
  updateProps?: RequestConfig
  deleteProps?: RequestConfig
  headerTitle?: string | ((addButton: ReactElement, actionRef: ActionRefProps) => ReactElement)
  toolBarRender?: false | ((setting: ReactElement[], actionRef: ActionRefProps) => ReactElement[])
  handleOperating?: (data: OperatingItem[]) => OperatingItem[]
  formItems?: DynamicFormItem[]
  filterItems?: DynamicFormItem[]
  filterProps?: FilterFormProps
  [key: string]: any
}

const IntegrationTable: ForwardRefRenderFunction<IntegrationTableRefs, IntegrationTableProps> = (
  props,
  ref,
) => {
  let {
    listProps,
    addProps,
    updateProps,
    deleteProps,
    handleOperating,
    formItems,
    filterItems,
    filterProps,
    ...otherProps
  } = props

  // 组件是否已经卸载
  let isUnMounted = false

  // 内容区域元素
  const containerRef: any = useRef()

  // 表格数据
  const [tableData, setTableData] = useState<any>([])
  // 表格loading
  const [tableLoading, setTableLoading] = useState<boolean>(false)
  // 表格分页配置
  const [tablePagination, setTablePagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10
  })
  // 表格行选中项key配置
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
  // 表格行选中项配置
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  // 表格是否全屏显示
  const [fullscreen, setFullscreen] = useState<boolean>(false)

  // 过滤表单实例
  const [filterForm, setFilterForm] = useState<FormInstance>()

  // 弹窗表单数据
  const [formValues, setFormValues] = useState<any>()
  // 弹窗表单类型
  const [formType, setFormType] = useState<any>()
  // 弹窗动态表单实例
  let modalForm: any = useRef()

  // 过滤表单配置
  filterProps = {
    ref: (fForm: FormInstance) => {
      setFilterForm(fForm)
    },
    isInCard: true,
    formItems: getArray(filterItems),
    resetProps: {
      onClick: ({ values }: any) => {
        getTableData({
          ...tablePagination,
          current: 1,
          ...values
        })
      }
    },
    submitProps: {
      loading: tableLoading,
      onClick: ({ values }: any) => {
        getTableData({
          ...tablePagination,
          current: 1,
          ...values
        })
      }
    },
    ...filterProps
  }

  // 表格实例
  const actionRef: ActionRefProps = {
    // 重新加载表格
    reload: (current?: number) => {
      getTableData({
        ...tablePagination,
        ...filterForm?.getFieldsValue?.(),
        ...(isNumber(current) ? { current } : {})
      })
    },
    // 获取表格行选中项id
    getSelected: () => {
      return selectedRowKeys
    },
    // 设置表格行选中项id
    setSelected: (keys: any) => {
      setSelectedRowKeys(keys)
    },
    // 获取表格行选中项
    getSelectedRows: () => {
      return selectedRows
    },
    // 清空表格行选中项
    clearSelected: () => {
      setSelectedRowKeys([])
    },
    // 清除过滤表单
    reset: () => {
      filterForm?.resetFields?.()
    }
  }
  // 表格props
  const tableProps: any = {
    ...otherProps,
    // 表格分页
    ...(otherProps?.pagination !== false ? {
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total: number, range: number[]) => (
          `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`
        ),
        ...tablePagination,
        ...otherProps?.pagination
      }
    } : {}),
    // 表格行选中项
    ...(otherProps?.rowSelection ? {
      rowSelection: {
        selectedRowKeys,
        preserveSelectedRowKeys: true,
        onChange: (keys: any, rows: any) => {
          setSelectedRowKeys(keys)
          setSelectedRows(rows)
        },
        ...otherProps?.rowSelection
      }
    } : {}),
    // 表格数据
    dataSource: tableData,
    // 表格loading
    loading: tableLoading,
    // 分页、排序、筛选变化事件
    onChange: (pagination: any, filters: any, sorter: any, extra: any) => {
      const { action } = extra
      if (action === 'paginate' && tableProps.pagination) {
        getTableData({
          ...pagination,
          ...filterForm?.getFieldsValue?.()
        })
      }
      otherProps.onChange?.(pagination, filters, sorter, extra)
    }
  }

  const { rowKey, columns } = tableProps

  // 暴露给父组件数据
  useImperativeHandle(ref, () => ({
    filterForm,
    modalForm,
    actionRef
  }))

  // 请求处理
  async function handleRequest(requestProps: RequestConfig = {}, data?: any, record?: any) {
    const { url, method, requestBefore, requestAfter, urlHandle, paramsHandle, responseHandle } = requestProps
    // 请求之前处理方法
    await requestBefore?.(data, record)
    // 请求参数处理
    const params = paramsHandle ? await paramsHandle?.(data, record) : data
    // 请求地址处理
    const requestUrl = urlHandle ? await urlHandle?.(data, record) : getString(url)
    if (!requestProps.requestType) requestProps.requestType = 'data'
    const requestFunc: any = requestProps?.requestFunc || ((url: any, options: any) => request.base(url, options))
    const res = await requestFunc(requestUrl, {
      method,
      [requestProps.requestType]: params,
      contentType: requestProps.contentType
    })
    // 请求之后处理方法
    await requestAfter?.(res)
    // 请求结果处理
    const result = responseHandle ? await responseHandle?.(res) : res
    return result
  }

  // 获取弹窗标题
  function getModalTitle(requestProps?: RequestConfig, prefixText: string = '') {
    if (requestProps?.modalProps?.title) return requestProps?.modalProps?.title
    return prefixText
  }

  // 打开表单弹窗
  async function openModal(requestProps?: RequestConfig) {
    const modalProps = requestProps?.modalProps
    // 弹窗打开之前调用
    await modalProps?.openBefore?.(formValues)
    const record = {
      ...((await modalProps?.formValuesHandle?.(formValues)) || formValues)
    }
    // 动态表单元素
    const modalFormItems = modalProps?.formItems
    let modalFormContent: React.ReactNode
    let formState: Record<string, any> = {}
    if (modalFormItems || modalProps?.formItemsHandle) {
      formState = {
        formItems: modalFormItems,
        formProps: modalProps?.formProps,
        formValues: record,
      }
      modalFormContent = (vm: any) => {
        const { formItems, formProps, formValues } = vm.state
        return (
          <DynamicForm
            ref={(refs: any) => (modalForm = refs)}
            formItems={isFunction(modalProps?.formItemsHandle)
              ? modalProps?.formItemsHandle?.(formItems, vm)
              : formItems}
            formProps={formProps}
            formValues={formValues}
          />
        )
      }
    }

    // 状态
    let state: Record<string, any> = {
      record,
      actionRef,
      ...formState,
    }
    // 方法
    let funcs = {}
    // 渲染方法
    let render: any = modalFormContent
    if (isValidElement(modalProps?.content)) {
      render = () => modalProps?.content
    } else if (isFunction(modalProps?.content)) {
      render = modalProps?.content
    } else {
      state = objectMerge(state, modalProps?.content?.state)
      if (modalProps?.content?.render) {
        render = modalProps?.content?.render
      }
      funcs = {
        ...modalProps?.content
      }
    }
    if (isFunction(modalProps?.stateHandle)) {
      state = {
        ...modalProps?.stateHandle(state)
      }
    }

    // 弹窗实例
    let modalRef: any
    // 打开弹窗
    modalRef = modal({
      bodyStyle: { padding: '32px 40px 48px' },
      ...modalProps,
      onOk: async () => {
        if (isFunction(modalProps?.onOk)) {
          const modalParams: any = {
            form: modalForm?.form,
            record,
            actionRef,
            modalRef
          }
          const okReturn = await modalProps?.onOk(modalParams)
          if (okReturn) {
            setFormType(null)
            setFormValues(null)
          }
          return okReturn
        }
        // 如果有表单发起请求
        if (modalForm?.form) {
          try {
            const formData = await modalForm.form?.validateFields?.()
            const hide = message.loading(requestProps?.loadingMsg || '正在操作')
            const res = await handleRequest(
              requestProps,
              {
                ...modalForm?.form?.getFieldValue?.('extraParams'),
                ...formData,
                ...modalForm?.form?.getFieldValue?.(locationName),
                ...(isString(rowKey) && record[rowKey]
                  ? { [rowKey]: record[rowKey] }
                  : {}),
              },
              record,
            )
            if (res) {
              hide()
              actionRef.reload?.()
              message.success(requestProps?.successMsg || '操作成功！')
              setFormType(null)
              setFormValues(null)
              return true
            }
            hide()
          } catch (e) { }
          return false
        }
        return true
      },
      onCancel: () => {
        if (isFunction(modalProps?.onCancel)) {
          modalProps?.onCancel({
            form: modalForm?.form,
            record,
            actionRef,
            modalRef
          } as any)
        }
        setFormType(null)
        setFormValues(null)
      },
      content: {
        ...funcs,
        state,
        render: (vm: any) => render?.(vm, () => {
          return modalRef
        })
      }
    })
  }

  // 是否有新增操作
  if (addProps || tableProps?.headerTitle) {
    const headerTitle: any = tableProps.headerTitle
    const modalFormItems = addProps?.modalProps?.formItems || formItems
    addProps = {
      method: 'POST',
      btnText: '新增',
      loadingMsg: '正在新增',
      successMsg: '新增成功！',
      requestType: 'data',
      ...addProps,
      modalProps: {
        ...addProps?.modalProps,
        ...(modalFormItems ? { formItems: modalFormItems } : {}),
        title: getModalTitle(addProps, '新增'),
      },
    }
    const addButton = (
      <Button
        type="primary"
        onClick={() => {
          setFormValues({})
          setFormType('add')
        }}
      >
        <PlusOutlined /> {addProps.btnText}
      </Button>
    )
    tableProps.headerTitle = isFunction(headerTitle)
      ? headerTitle?.(addButton, actionRef)
      : addButton
  }

  // 是否有更新操作
  if (updateProps) {
    const modalFormItems = updateProps?.modalProps?.formItems || formItems
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
        title: getModalTitle(updateProps, '更新'),
      },
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
        ...deleteProps?.popProps,
      },
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
      const { pageSize, current, total, ...other } = params

      const res = await handleRequest(listProps, {
        page: current,
        size: pageSize,
        ...other,
      })

      let data = res?.records || (res instanceof Array ? res : [])
      // 没有rowKey时自定义成序列号
      if (
        isNotEmptyArray(data) &&
        data.every((e: any) => isString(rowKey) && !e[rowKey])
      ) {
        data = data.map((item: any, index: number) => ({
          ...item,
          ...(isString(rowKey) ? { [rowKey]: index + 1 } : {}),
        }))
      }

      return {
        data,
        total: res?.total,
        current,
        pageSize
      }
    }
  }

  // 设置全屏
  function fullscreenChange() {
    if (document.fullscreenEnabled && containerRef?.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
        setFullscreen(false)
      } else {
        containerRef.current.requestFullscreen()
        setFullscreen(true)
      }
    }
  }

  // 工具栏
  tableProps.toolBarRender = [
    <Tooltip title="刷新" getPopupContainer={() => containerRef.current}>
      <ReloadOutlined onClick={() => actionRef.reload?.()} />
    </Tooltip>,
    <Tooltip title={fullscreen ? '退出全屏' : '全屏'} getPopupContainer={() => containerRef.current}>
      {fullscreen
        ? <FullscreenOutlined onClick={fullscreenChange} />
        : <FullscreenExitOutlined onClick={fullscreenChange} />}
    </Tooltip>,
  ]
  if (isFunction(otherProps.toolBarRender)) {
    tableProps.toolBarRender = otherProps.toolBarRender(tableProps.toolBarRender, actionRef)
  }
  if (otherProps.toolBarRender === false) {
    tableProps.toolBarRender = []
  }

  // 获取表格数据
  async function getTableData({ showSizeChanger, showQuickJumper, ...params }: any = {}) {
    setTableLoading(true)

    // 去除空值
    params = Object.entries(getObject(params))
      .reduce((t, [key, value]) => {
      return {
        ...t,
        ...(isNotNullOrUndefined(value) ? { [key]: value } : {})
      }
    }, {})
    const res = await tableProps.request?.(params)
    const { data, ...pagination } = getObject(res)

    setTableData(data)
    setTablePagination(pagination)

    setTableLoading(false)
  }

  // 操作项列表
  let operatingItems: OperatingItem[] = [
    { type: 'modal', props: updateProps },
    { type: 'pop', props: deleteProps },
  ].filter((f: OperatingItem) => f.props)
  operatingItems = handleOperating?.(operatingItems) || operatingItems
  // 列表是否含有操作项
  const operating = [
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: sum(
        operatingItems,
        (data: any, index: number) => {
          const btnText = isFunction(data?.props?.btnText)
            ? data?.props?.btnText(false)
            : data?.props?.btnText
          return getNumber(btnText?.length) * 14 + (index ? 20 : 0)
        },
        16 * 2,
      ),
      render: (_: any, record: any) => {
        return (
          <>
            {operatingItems.map((item, index) => {
              let btnElement
              const btnText = isFunction(item?.props?.btnText)
                ? item?.props?.btnText(record)
                : item?.props?.btnText
              const hasPrevBtn = operatingItems.slice(0, index).some((x) => {
                return Boolean(
                  isFunction(x?.props?.btnText) ? x?.props?.btnText(record) : x?.props?.btnText,
                )
              })
              const onConfirm = item?.props?.popProps?.onConfirm
              const onCancel = item?.props?.popProps?.onCancel
              const cParams: any = {
                record,
                table: actionRef,
              }
              switch (item.type) {
                // 编辑
                case 'modal':
                  btnElement = (
                    <a
                      onClick={() => {
                        setFormValues(record)
                        setFormType(item.type + index)
                      }}
                      {...item?.props?.aProps?.(record)}
                    >
                      {btnText}
                    </a>
                  )
                  break
                // 删除
                case 'pop':
                  btnElement = (
                    <Popconfirm
                      title=""
                      {...item?.props?.popProps}
                      onConfirm={async () => {
                        if (isFunction(onConfirm)) {
                          onConfirm?.(cParams)
                          return
                        }
                        try {
                          const hide = message.loading(item?.props?.loadingMsg || '正在操作')
                          const res = await handleRequest(
                            item?.props,
                            {
                              ...(isString(rowKey) && record[rowKey]
                                ? { [rowKey]: record[rowKey] }
                                : {}),
                            },
                            record,
                          )
                          if (res) {
                            if (btnText?.includes('删除') && tableData.length === 1) {
                              actionRef.reload?.(1)
                            } else {
                              actionRef.reload?.()
                            }
                            message.success(item?.props?.successMsg || '操作成功！')
                          }
                          hide()
                        } catch { }
                      }}
                      onCancel={() => onCancel?.(cParams)}
                    >
                      <a {...item?.props?.aProps?.(record)}>{btnText}</a>
                    </Popconfirm>
                  )
                  break
                // 自定义
                case 'custom':
                  btnElement = (
                    <a
                      onClick={() => item?.props?.btnClick?.(record)}
                      {...item?.props?.aProps?.(record)}
                    >
                      {btnText}
                    </a>
                  )
                  break
                default:
                  break
              }
              return (
                <span key={index}>
                  {hasPrevBtn && btnText && <Divider type="vertical" />}
                  {btnElement}
                </span>
              )
            })}
          </>
        )
      },
    },
  ]

  if (operatingItems.length) {
    const newColumns: any = columns instanceof Array ? columns : []
    tableProps.columns = [...newColumns, ...operating]
  }

  // 初始化获取数据
  useEffect(() => {
    if (!filterProps?.formItems || isEmptyArray(filterProps?.formItems) || filterForm) {
      getTableData({
        ...tablePagination,
        ...filterForm?.getFieldsValue?.()
      })
    }
  }, [filterForm])

  // 弹窗数据变动及打开
  useEffect(() => {
    if (formValues && formType) {
      const formTypeMap = {
        add: addProps,
        ...operatingItems.reduce((t: any, c: OperatingItem, cIndex) => {
          if (c.type === 'modal') {
            return {
              ...t,
              [c.type + cIndex]: c.props,
            }
          }
          return t
        }, {}),
      }
      openModal(formTypeMap[formType])
    }
    return () => {
      isUnMounted = true
    }
  }, [formValues, formType])

  return (
    <div ref={containerRef} style={{ background: '#fff' }}>
      <Card bordered={false}>
        {/* 过滤表单 */}
        {
          isNotEmptyArray(filterProps?.formItems) &&
          <div style={{ margin: '10px 0 20px' }}>
            <FilterForm {...filterProps} />
          </div>
        }
        {/* 操作栏 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}>
          {/* 表格标题&操作按钮 */}
          <div>
            <Space>
              {
                isFunction(tableProps.headerTitle)
                  ? tableProps.headerTitle()
                  : tableProps.headerTitle
              }
            </Space>
          </div>
          {/* 工具栏 */}
          <div>
            <Space size={12} style={{
              display: 'flex',
              alignItems: 'center',
              marginRight: 6
            }}>
              {
                tableProps.toolBarRender?.map((item: any, index: number) => (
                  <div key={index} style={{
                    fontSize: 16,
                    cursor: 'pointer',
                    padding: '0 4px',
                    lineHeight: 'normal'
                  }}>{item}</div>
                ))
              }
            </Space>
          </div>
        </div>
        {/* 表格选中项统计条 */}
        {
          isNotEmptyArray(selectedRowKeys) &&
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 48,
            padding: '0 9px 0 24px',
            border: '1px solid #91d5ff',
            background: '#e6f7ff',
            marginBottom: 16,
            transition: 'all .5s'
          }}>
            <span>已选择 {selectedRowKeys.length} 项</span>
            <Button type="link" onClick={actionRef.clearSelected}>取消选择</Button>
          </div>
        }
        {/* 表格 */}
        <Table {...tableProps} />
      </Card>
    </div>
  )
}

export default forwardRef(IntegrationTable)
