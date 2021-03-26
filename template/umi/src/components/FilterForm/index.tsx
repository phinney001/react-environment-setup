import React, {
  useState,
  useEffect,
  useRef,
  ReactElement,
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
} from 'react'
import DynamicForm, { DynamicFormItem, DynamicFormProps } from '../DynamicForm'
import { COLLAPSED_EVENT_NAME, event } from '@/layouts/UserLayout'
import { getNumber, getString, isNotEmptyArray, objectMerge } from 'phinney-toolkit'
import { useThrottle } from '@/hooks'
import { Button, ButtonProps, FormInstance, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'

/**
 * @param formItemWith 表单元素宽度
 * @param formLabelWidth 表单标签宽度
 * @param resetProps 表单重置按钮props
 * @param submitProps 表单提交按钮props
 * @param handleButton 处理按钮元素
 * @param isInCard 是否在卡片中
 */
export interface FilterFormProps extends DynamicFormProps {
  formItemWidth?: number
  formLabelWidth?: number
  resetProps?: ButtonProps
  submitProps?: ButtonProps
  handleButton?: (btns: ReactElement, filterForm: FormInstance) => ReactElement
  isInCard?: boolean
}

const FilterForm: ForwardRefRenderFunction<FormInstance, FilterFormProps> = (props, ref) => {
  // 组件是否已经卸载
  let isUnMounted = false
  // 过滤表单主要区域元素
  const filterMain = useRef<any>()
  // 显示按钮
  const [btnShow, setBtnShow] = useState(false)
  // 展开/收起
  const [collapsed, setCollapsed] = useState(false)
  // 表单宽度
  const [formWidth, setFormWidth] = useState(500)
  // 表单按钮排序
  const [order, setOrder] = useState(0)
  // 过滤表单实例
  const [filterForm, setFilterForm] = useState<FormInstance>()

  const {
    formItemWith = 260,
    formLabelWidth,
    rowProps,
    formProps,
    formItems,
    resetProps,
    submitProps,
    handleButton,
    isInCard,
    ...otherProps
  } = props

  // 暴露给父组件数据
  useImperativeHandle(ref, () => filterForm as FormInstance)

  /**
   * 获取字符串宽度
   * @param text 字符串
   * @param fontSize 字体大小
   */
  function getTextWidth(text: string, fontSize: number): number {
    const result = { width: 0, height: 0 }
    const span: HTMLSpanElement = document.createElement('span')
    span.innerHTML = text
    span.style.visibility = 'hidden'
    span.style.fontSize = fontSize + 'px'
    document.body.appendChild(span)
    result.width = span.offsetWidth
    result.height = span.offsetHeight
    span.parentNode?.removeChild(span)
    return getNumber(result.width)
  }

  // 表单label最大宽度
  const maxLabelWidth =
    formLabelWidth ||
    Math.max(
      ...formItems?.map((item: DynamicFormItem) => {
        return getTextWidth(`${item.required ? '*' : ''}${getString(item?.label)}：`, 14)
      }),
    )

  // 过滤表单宽度变化
  const handleResize = useThrottle(() => {
    setTimeout(() => {
      // 表单项宽度
      const itemWidth = getNumber(formItemWith) + maxLabelWidth + 24
      // 总宽度
      const totalWidth = getNumber(filterMain?.current?.offsetWidth)
      // 按钮排序
      const btnOrder = Math.floor(totalWidth / itemWidth) - 1

      if (!isUnMounted) {
        setBtnShow(true)
        if (btnOrder < 1) {
          setCollapsed(true)
        }
        setOrder(btnOrder)
        setFormWidth(totalWidth)
      }
    }, 200)
  }, 200)

  // 按钮props
  const btnProps = {
    // 重置
    resetProps: {
      ...resetProps,
      onClick: async () => {
        filterForm?.resetFields()
        const values = await filterForm?.validateFields?.()
        resetProps?.onClick?.({ values, filterForm } as any)
      },
    },
    // 查询
    submitProps: {
      ...submitProps,
      onClick: async () => {
        const values = await filterForm?.validateFields?.()
        submitProps?.onClick?.({ values, filterForm } as any)
      },
    },
  }

  // 动态表单props
  const dynamicFormProps = {
    // 表单props
    formProps: objectMerge({ layout: 'inline' }, formProps),
    // 表单项
    formItems: [
      ...formItems.map((item: DynamicFormItem, index: number) => ({
        ...objectMerge(
          {
            colProps: {
              style: {
                position: 'relative',
                flex: '0 0 auto',
                marginBottom: 24,
                order: index + 1,
                width: `${100 / (order + 1)}%`,
              },
            },
            formItemProps: {
              style: {
                margin: 0,
                width: getNumber(formItemWith) + maxLabelWidth,
              },
              labelCol: {
                flex: `0 0 ${maxLabelWidth}px`,
              },
            },
            fieldProps: {
              style: {
                width: getNumber(formItemWith),
              },
            },
          },
          item,
        ),
      })),
      // 按钮
      {
        type: 'custom',
        colProps: {
          style: {
            flex: '0 0 auto',
            marginLeft: 'auto',
            width: `${100 / (order + 1)}%`,
            order: collapsed ? formItems?.length : order,
          },
        },
        formItemProps: {
          style: {
            margin: 0,
            width: getNumber(formItemWith) + maxLabelWidth,
          },
        },
        render: () => {
          const buttons = (
            <>
              <Button {...btnProps.resetProps}>重置</Button>
              <Button type="primary" {...btnProps.submitProps}>
                查询
              </Button>
            </>
          )
          return (
            btnShow &&
            isNotEmptyArray(formItems) && (
              <Space
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                {handleButton ? handleButton?.(buttons, filterForm as FormInstance) : buttons}
                <a
                  style={{ marginLeft: 6, userSelect: 'none' }}
                  onClick={() => {
                    !isUnMounted && setCollapsed(!collapsed)
                  }}
                >
                  {order >= 1 && formItems?.length !== order && formItems?.length > order && (
                    <>
                      {collapsed ? '收起' : '展开'}
                      <DownOutlined
                        style={{
                          marginLeft: 7,
                          transition: 'all 0.3s ease 0s',
                          transform: `rotate(${collapsed ? 0.5 : 0}turn)`,
                        }}
                      />
                    </>
                  )}
                </a>
              </Space>
            )
          )
        },
      },
    ],
    // 行
    rowProps: objectMerge(
      {
        style: {
          width: '100%',
          margin: 0,
        },
      },
      rowProps,
    ),
    ref: (refs: any) => {
      !isUnMounted && setFilterForm(refs?.form)
    },
    ...otherProps,
  }

  // 窗口变化监听&销毁
  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    event.on(COLLAPSED_EVENT_NAME, handleResize)

    return () => {
      isUnMounted = true
      window.removeEventListener('resize', handleResize)
      event.off(COLLAPSED_EVENT_NAME, handleResize)
    }
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        background: '#fff',
        padding: isInCard ? 0 : 24,
        paddingBottom: !collapsed || !(formItems?.length % (order + 1)) ? 24 : 0,
      }}
    >
      <div ref={filterMain}>
        <div
          style={{
            width: collapsed ? '100%' : formWidth,
            height: collapsed ? 'auto' : 32,
            overflow: 'hidden',
          }}
        >
          <DynamicForm {...dynamicFormProps} />
        </div>
      </div>
    </div>
  )
}

export default forwardRef(FilterForm)
