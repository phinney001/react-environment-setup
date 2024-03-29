import React, {
  useState,
  useRef,
  useEffect,
  ForwardRefRenderFunction,
  useImperativeHandle,
  forwardRef,
  isValidElement,
  ReactElement,
} from 'react';
import ProTable, { ActionType, ProTableProps } from '@ant-design/pro-table';
import { FormProps } from 'antd/lib/form';
import DynamicForm, { DynamicFormItem, locationName } from '../DynamicForm';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, Divider } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import request from '@/utils/request';
import { CustomModalProps, modal } from '../CustomModal';
import { FormInstance } from 'antd/es/form';
import { PopconfirmProps } from 'antd/es/popconfirm';
import { getNumber, isFunction, objectMerge, sum } from 'phinney-toolkit';

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
  width?: number;
  title?: string;
  formProps?: FormProps;
  formItems?: DynamicFormItem[];
  stateHandle?: (state: any) => Record<string, any>;
  formItemsHandle?: (formItems: any, vm: any) => DynamicFormItem[];
  formValuesHandle?: (params: any) => any;
  openBefore?: (params?: any) => void;
  [key: string]: any;
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
 * @param btnText 按钮显示文字
 * @param btnClick 按钮点击事件(仅支持自定义操作项)
 * @param loadingMsg 请求中提示文字
 * @param successMsg 请求成功提示文字
 * @param modalProps 弹窗props
 * @param popProps 删除提示窗props
 * @param aProps a标签props方法
 * @param effect 请求成功是否会影响数据数量
 */
export interface RequestConfig {
  url?: string;
  method?: string;
  urlHandle?: (params: any, record?: any) => any;
  paramsHandle?: (params: any, record?: any) => any;
  responseHandle?: (params: any) => any;
  requestBefore?: (params?: any) => void;
  requestAfter?: (params?: any) => void;
  requestFunc?: (url?: string, options?: any) => any;
  requestType?: 'params' | 'data';
  btnText?: string | ((record?: any) => string);
  btnClick?: (record?: any, callback?: () => void) => void;
  loadingMsg?: string;
  successMsg?: string;
  modalProps?: ModalProps;
  popProps?: PopconfirmProps;
  aProps?: (record?: any) => any;
  effect?: boolean
  [key: string]: any;
}

/**
 * 操作项配置
 * @param type 按钮类型
 * @param props 按钮请求配置
 */
export interface OperatingItem {
  type: 'pop' | 'modal' | 'custom' | string;
  props?: RequestConfig | undefined;
}

/**
 * 一体化表格refs接口
 * @param filterForm 搜索表单实例
 * @param modalForm 弹窗表单实例
 * @param actionRef 表格实例
 */
export interface IntegrationTableRefs {
  filterForm?: FormInstance;
  modalForm?: FormInstance;
  actionRef?: ActionType;
}

/**
 * 一体化表格props接口
 * @param listProps 列表数据配置
 * @param addProps 添加数据配置
 * @param updateProps 更新数据配置
 * @param deleteProps 删除数据配置
 * @param headerTitle 标题&操作按钮
 * @param handleOperating 处理/新增操作项
 * @param formItems 新增/编辑弹窗表单配置列表
 * @param isInModal 表格是否嵌套在弹窗中
 * @param tableBefore 表格上面元素
 * @param tableAfter 表格下面元素
 */
export interface IntegrationTableProps extends ProTableProps<any, any> {
  listProps?: RequestConfig;
  addProps?: RequestConfig;
  updateProps?: RequestConfig;
  deleteProps?: RequestConfig;
  headerTitle?: string | ((addButton: ReactElement, actionRef: ActionType) => ReactElement)
  handleOperating?: (data: OperatingItem[]) => OperatingItem[];
  formItems?: DynamicFormItem[];
  isInModal?: boolean;
  tableBefore?: () => ReactElement,
  tableAfter?: () => ReactElement,
  [key: string]: any;
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
    isInModal,
    tableBefore,
    tableAfter,
    ...otherProps
  } = props;

  // 组件是否已经卸载
  let isUnMounted = false;
  // 表格数据
  const [tableData, setTableData] = useState<any>([])
  // 弹窗表单数据
  const [formValues, setFormValues] = useState<any>();
  // 弹窗表单类型
  const [formType, setFormType] = useState<any>();
  // 过滤表单实例
  const filterForm: any = useRef();
  // 弹窗动态表单实例
  let modalForm: any = useRef();
  // 表格实例
  const actionRef: any = useRef<ActionType>();
  // 表格props
  const tableProps: any = {
    // pagination: {
    //   size: 'default',
    // },
    ...otherProps,
  };
  const { rowKey, columns } = tableProps;

  // 删除含有冲突的表单字段
  if (Reflect.has(tableProps, 'actionRef')) {
    Reflect.deleteProperty(tableProps, 'actionRef');
  }
  if (Reflect.has(tableProps, 'formRef')) {
    Reflect.deleteProperty(tableProps, 'formRef');
  }
  // 分页参数默认值
  if (!Reflect.has(tableProps, 'pagination')) {
    tableProps.pagination = {
      size: 'default',
      showQuickJumper: true,
    };
  }

  // 暴露给父组件数据
  useImperativeHandle(ref, () => ({
    filterForm: filterForm?.current,
    modalForm: modalForm?.current,
    actionRef: actionRef?.current,
  }));

  // 请求处理
  const handleRequest = async (requestProps: RequestConfig = {}, data?: any, record?: any) => {
    const {
      url,
      method,
      requestBefore,
      requestAfter,
      urlHandle,
      paramsHandle,
      responseHandle,
    } = requestProps;
    // 请求之前处理方法
    await requestBefore?.();
    // 请求参数处理
    const params = paramsHandle ? await paramsHandle?.(data, record) : data;
    // 请求地址处理
    const requestUrl = urlHandle ? await urlHandle?.(data, record) : url || '';
    if (!requestProps.requestType) requestProps.requestType = 'data';
    const requestFunc = requestProps?.requestFunc || request;
    const res = await requestFunc(requestUrl, {
      method,
      [requestProps.requestType]: params,
    });
    // 请求之后处理方法
    await requestAfter?.();
    // 请求结果处理
    const result = responseHandle ? await responseHandle?.(res) : res;
    return result;
  };

  // 获取弹窗标题
  const getModalTitle = (requestProps?: RequestConfig, prefixText: string = '') => {
    if (requestProps?.modalProps?.title) return requestProps?.modalProps?.title;
    return prefixText;
  };

  // 打开表单弹窗
  const openModal = async (requestProps?: RequestConfig) => {
    const modalProps = requestProps?.modalProps;
    // 弹窗打开之前调用
    await modalProps?.openBefore?.();
    const record = {
      ...((await modalProps?.formValuesHandle?.(formValues)) || formValues)
    };
    // 动态表单元素
    const modalFormItems = modalProps?.formItems;
    let modalFormContent: React.ReactNode;
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
      modalFormContent
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

    // 打开弹窗
    const modalRef: any = modal({
      bodyStyle: { padding: '32px 40px 48px' },
      ...modalProps,
      ...(modalFormItems ? { formItems: modalFormItems } : {}),
      onOk: async () => {
        if (isFunction(modalProps?.onOk)) {
          const modalParams: any = {
            form: modalForm?.form,
            record,
          };
          const okReturn = await modalProps?.onOk(modalParams);
          if (okReturn && !isUnMounted) {
            setFormType(null);
            setFormValues(null);
          }
          return okReturn;
        }
        // 如果有表单发起请求
        if (modalForm?.form) {
          try {
            const formData = await modalForm.form?.validateFields?.();
            const hide = message.loading(requestProps?.loadingMsg || '正在操作');
            const res = await handleRequest(
              requestProps,
              {
                ...modalForm?.form?.getFieldValue?.('extraParams'),
                ...formData,
                ...modalForm?.form?.getFieldValue?.(locationName),
                ...(typeof rowKey === 'string' && record[rowKey]
                  ? { [rowKey]: record[rowKey] }
                  : {}),
              },
              record,
            );
            if (res) {
              hide();
              if (requestProps?.effect && tableData.length === 1) {
                actionRef?.current?.reload?.(1)
              } else {
                actionRef?.current?.reload?.()
              }
              message.success(requestProps?.successMsg || '操作成功！');
              if (!isUnMounted) {
                setFormType(null);
                setFormValues(null);
              }
              return true;
            }
            hide();
          } catch (e) { }
          return false;
        }
        return true;
      },
      onCancel: () => {
        if (isFunction(modalProps?.onCancel)) {
          modalProps?.onCancel(actionRef?.current);
        }
        if (!isUnMounted) {
          setFormType(null);
          setFormValues(null);
        }
      },
      content: {
        ...funcs,
        state,
        render: (vm: any) => render?.(vm, () => {
          return modalRef
        })
      }
    });
  };

  // 是否有新增操作
  if (addProps || tableProps?.headerTitle) {
    const headerTitle: any = tableProps.headerTitle;
    const modalFormItems = addProps?.modalProps?.formItems || formItems;
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
    };
    const addButton = (
      <Button
        type="primary"
        onClick={() => {
          if (!isUnMounted) {
            setFormValues({});
            setFormType('add');
          }
        }}
      >
        <PlusOutlined /> {addProps.btnText}
      </Button>
    );
    tableProps.headerTitle = isFunction(headerTitle)
      ? headerTitle?.(addButton, actionRef)
      : addButton;
  }

  // 是否有更新操作
  if (updateProps) {
    const modalFormItems = updateProps?.modalProps?.formItems || formItems;
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
    };
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
    };
  }

  // 是否有列表请求
  if (listProps) {
    listProps = {
      method: 'POST',
      requestType: 'data',
      ...listProps,
    };
    tableProps.request = async (params: any = {}) => {
      const { pageSize, current, ...other } = params;

      const response = await handleRequest(listProps, {
        pageIndex: current,
        pageSize,
        ...other,
      });
      const res = response?.data

      let data = res?.list || (res instanceof Array ? res : []);
      // 没有rowKey时自定义成序列号
      if (
        data.length &&
        data.every((e: any) => typeof rowKey === 'string' && !e[rowKey])
      ) {
        data = data.map((item: any, index: number) => ({
          ...item,
          ...(typeof rowKey === 'string' ? { [rowKey]: index + 1 } : {}),
        }));
      }

      setTableData(data)

      return {
        data,
        total: res?.count,
        success: true,
      };
    };
  }

  // 操作项列表
  let operatingItems: OperatingItem[] = [
    { type: 'modal', props: updateProps },
    { type: 'pop', props: deleteProps },
  ].filter((f: OperatingItem) => f.props);
  operatingItems = handleOperating?.(operatingItems) || operatingItems;
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
            : data?.props?.btnText;
          return getNumber(btnText?.length) * 14 + (index ? 20 : 0);
        },
        16,
      ),
      render: (_: any, record: any) => {
        return (
          <>
            {operatingItems.map((item, index) => {
              let btnElement;
              const btnText = isFunction(item?.props?.btnText)
                ? item?.props?.btnText(record)
                : item?.props?.btnText;
              const hasPrevBtn = operatingItems.slice(0, index).some((x) => {
                return Boolean(
                  isFunction(x?.props?.btnText) ? x?.props?.btnText(record) : x?.props?.btnText,
                );
              });
              const onConfirm = item?.props?.popProps?.onConfirm;
              const onCancel = item?.props?.popProps?.onCancel;
              const cParams: any = {
                record,
                table: actionRef?.current,
              };
              switch (item.type) {
                // 编辑
                case 'modal':
                  btnElement = (
                    <a
                      onClick={() => {
                        if (!isUnMounted) {
                          setFormValues(record);
                          setFormType(item.type + index);
                        }
                      }}
                      {...item?.props?.aProps?.(record)}
                    >
                      {btnText}
                    </a>
                  );
                  break;
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
                          const hide = message.loading(item?.props?.loadingMsg || '正在操作');
                          const res = await handleRequest(
                            item?.props,
                            {
                              ...(typeof rowKey === 'string' && record[rowKey]
                                ? { [rowKey]: record[rowKey] }
                                : {}),
                            },
                            record,
                          );
                          if (res) {
                            if ((item?.props?.effect || btnText?.includes('删除')) && tableData.length === 1) {
                              actionRef?.current?.reload?.(1)
                            } else {
                              actionRef?.current?.reload?.()
                            }
                            message.success(item?.props?.successMsg || '操作成功！');
                          }
                          hide();
                        } catch { }
                      }}
                      onCancel={() => onCancel?.(cParams)}
                    >
                      <a {...item?.props?.aProps?.(record)}>{btnText}</a>
                    </Popconfirm>
                  );
                  break;
                // 自定义
                case 'custom':
                  btnElement = (
                    <a
                      onClick={() => item?.props?.btnClick?.(record)}
                      {...item?.props?.aProps?.(record)}
                    >
                      {btnText}
                    </a>
                  );
                  break;
                default:
                  break;
              }
              return (
                <span key={index}>
                  {hasPrevBtn && btnText && <Divider type="vertical" />}
                  {btnElement}
                </span>
              );
            })}
          </>
        );
      },
    },
  ];
  if (operatingItems.length) {
    const newColumns: any = columns instanceof Array ? columns : [];
    tableProps.columns = [...newColumns, ...operating];
  }

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
            };
          }
          return t;
        }, {}),
      };
      openModal(formTypeMap[formType]);
    }
    return () => {
      isUnMounted = true;
    };
  }, [formValues, formType]);

  // 渲染表格
  const renderTable = () => <ProTable actionRef={actionRef} formRef={filterForm} {...tableProps} />;

  return isInModal ? renderTable() : <PageContainer>{tableBefore?.()}{renderTable()}{tableAfter?.()}</PageContainer>;
};

export default forwardRef(IntegrationTable);
