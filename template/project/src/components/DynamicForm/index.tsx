import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import {
  Form,
  Input,
  Select,
  Button,
  InputNumber,
  DatePicker,
  TimePicker,
  Cascader,
  Row,
  Col,
  message,
} from 'antd'
import { FormProps } from 'antd/es/form'
import TextArea from 'antd/lib/input/TextArea'
import FormDragger from './FormDragger'
import { EnvironmentOutlined } from '@ant-design/icons'
import { checkPhone } from './FormValidate'
import FormUpload from './FormUpload'
import { modal } from '../CustomModal'
import FormLocation, { FormLocationRefs } from './FormLocation'
import { FormInstance, FormItemProps, Rule } from 'antd/lib/form'
import { ColProps } from 'antd/lib/col'

/**
 * 动态表单表单项接口
 * @param type 表单类型
 * @param label 表单标签
 * @param labelHidden 是否隐藏表单标签
 * @param name 表单字段名
 * @param span 表单所占空间
 * @param required 是否必填
 * @param rules 验证规则
 * @param options 下拉框、多选框数据
 * @param countDown 验证码倒计时时间
 * @param formItemProps 表单项props
 * @param fieldProps 表单元素props
 * @param colProps 表单空间props
 * @param beforeRender 表单前面附加元素方法
 * @param afterRender 表单后面附件元素方法
 * @param render 表单渲染方法
 */
export interface DynamicFormItem {
  type: string
  label?: string
  labelHidden?: boolean
  name?: string
  span?: number
  required?: boolean
  rules?: Rule[]
  countDown?: number
  options?: any[]
  formItemProps?: FormItemProps
  fieldProps?: any
  colProps?: ColProps
  beforeRender?: () => any
  afterRender?: () => any
  render?: () => any
  [key: string]: any
}

/**
 * 动态表单props接口
 * @param formValues 表单form元素数值
 * @param formProps 表单form元素props
 * @param formItems 表单项元素列表
 */
export interface DynamicFormProps {
  formValues?: any
  formProps?: FormProps
  formItems: DynamicFormItem[]
  [key: string]: any
}

/**
 * 动态表单refs接口
 * @param form 表单实例
 * @param locationRef 选点地图实例
 */
export interface DynamicFormRefs {
  form?: FormInstance,
  locationRef: FormLocationRefs
}

// 地图选点数据名称
export const locationName = 'LOCATION_VALUE'

const FormItem = Form.Item
const { RangePicker: DateRangePicker } = DatePicker
const { RangePicker: TimeRangePicker } = TimePicker
const { Password } = Input

/**
 * 输入类型表单
 * @param text 文本框
 * @param password 密码框
 * @param textarea 多行文本框
 * @param phone 手机文本框
 * @param captcha 验证码文本框
 * @param number 数值框
 */
const enterMap = {
  text: Input,
  password: Password,
  textarea: TextArea,
  phone: Input,
  captcha: Input,
  number: InputNumber,
}

/**
 * 选择类型表单
 * @param date 日期选择框
 * @param dateRange 开始&结束日期选择框
 * @param time 时间选择框
 * @param timeRange 开始&结束时间选择框
 * @param select 下拉选择框
 * @param cascader 多级选择框
 * @param location 位置选择框
 */
const selectMap = {
  date: DatePicker,
  dateRange: DateRangePicker,
  time: TimePicker,
  timeRange: TimeRangePicker,
  select: Select,
  cascader: Cascader,
  location: Input,
}

/**
 * 其他类型表单
 * @param upload 上传文件框
 * @param dragger 拖拽上传框
 * @param button 按钮
 * @param custom 自定义
 */
const otherMap = {
  upload: FormUpload,
  dragger: FormDragger,
  button: Button,
  custom: Input,
}

const DynamicForm: ForwardRefRenderFunction<DynamicFormRefs, DynamicFormProps> = (props, ref) => {
  const {
    formValues,
    formProps = {},
    formItems = [],
  } = props

  // 组件是否已经卸载
  let isUnMounted = false
  // 选点地图实例数据
  let locationRef: any = useRef()
  // 验证码相关state
  const [count, setCount] = useState<number>(60)
  const [countDown, setCountDown] = useState<number>(60)
  const [timing, setTiming] = useState(false)
  // 表单实例 
  const [form] = Form.useForm()
  
  // 删除含有冲突的表单字段
  if (Reflect.has(formProps, 'form')) {
    Reflect.deleteProperty(formProps, 'form')
  }

  // 暴露给父组件数据
  useImperativeHandle(ref, () => ({
    form,
    locationRef,
  }))
  
  // 验证码倒计时
  useEffect(() => {
    let interval: number = 0
    if (timing) {
      interval = window.setInterval(() => {
        !isUnMounted && setCount((preSecond) => {
          if (preSecond <= 1) {
            !isUnMounted && setTiming(false)
            clearInterval(interval)
            // 重置秒数
            return countDown
          }
          return preSecond - 1
        })
      }, 1000)
    }
    return () => {
      clearInterval(interval)
      isUnMounted = true
    }
  }, [timing])

  useEffect(() => {
    if (form && formValues) {
      form.setFieldsValue({ ...formValues })
    }
  }, [form, formValues])

  // 构建表单元素
  const buildField = (item: DynamicFormItem) => {
    const { label, type, fieldProps, render } = item
    const tipPrefix = getTipPrefixByType(type)
    const defaultProps = {
      ...(tipPrefix ? { placeholder: `${tipPrefix}${label}` } : {})
    }
    const props = Object.assign(defaultProps, fieldProps)
    const FormField = enterMap[type] || selectMap[type] || otherMap[type]
    const clickFunc = props.onClick
    const changeFunc = props.onChange
    const enterFunc = props.onEnter
    
    // 重组click事件
    if (clickFunc) {
      props.onClick = () => {
        clickFunc(form, item)
      }
    }
    // 重组变化事件
    if (changeFunc) {
      props.onChange = (event: any) => {
        changeFunc(event, form, item)
      }
    }
    // 回车事件
    if (enterFunc && !props.onPressEnter) {
      props.onPressEnter = (event: any) => {
        if (event.keyCode === 13) {
          enterFunc(form, item, event)
        }
      }
      Reflect.deleteProperty(props, 'onEnter')
    }

    if (type === 'button') {
      return <FormField {...props}>{label}</FormField>
    }
    if (type === 'custom') {
      return render?.()
    }

    return <FormField {...props} />
  }

  // 根据表单类型获取提示前缀
  const getTipPrefixByType = (type: string) => {
    if (enterMap[type]) {
      return '请输入'
    }
    if (selectMap[type] && !type.endsWith('Range')) {
      return '请选择'
    }
    return ''
  }

  // 构建表单验证规则
  const buildRules = ({ rules = [], required, type, label }: DynamicFormItem) => {
    if (required) {
      return [
        { required: true, message: `${getTipPrefixByType(type)}${label}!` },
        ...rules
      ]
    }
    return rules
  }

  // 处理表单项默认值
  const handleField = (item: DynamicFormItem) => {
    switch (item.type) {
      // 文本框
      case 'text':
      // 密码框
      case 'password':
      // 多行文本框
      case 'textarea':
        break;
      // 手机文本框
      case 'phone':
        item.rules = [
          ...(item.rules || []),
          { pattern: checkPhone, message: `${item.label}格式不正确！` }
        ]
        break;
      // 验证码
      case 'captcha':
        item.formItemProps = {
          style: { width: 'calc(100% - 126px)' }
        }
        item.colProps = {
          style: { display: 'flex', justifyContent: 'space-between' }
        }
        if (item.countDown && !isUnMounted) {
          setCountDown(item.countDown)
          setCount(item.countDown)
        }
        item.afterRender = () => {
          return (
            <>
              <Button
                disabled={timing}
                style={{ width: 120 }}
                size="large"
                onClick={async () => {
                  const bool = await item.getCaptcha?.()
                  !isUnMounted && bool && setTiming(true)
                }}
              >
                {timing ? `${count} 秒` : '获取验证码'}
              </Button>
            </>
          )
        }
        break;
      // 数值框
      case 'number':
      // 日期选择框
      case 'date':
      // 开始&结束日期选择框
      case 'dateRange':
      // 时间选择框
      case 'time':
      // 开始&结束时间选择框
      case 'timeRange':
        item.fieldProps = {
          style: { width: '100%' },
          ...item?.fieldProps
        }
        break;
      // 下拉选择框
      case 'select':
        item.fieldProps = {
          options: item?.options || [],
          ...item?.fieldProps
        }
        break;
      // 多级选择框
      case 'cascader':
        item.fieldProps = {
          options: item?.options || [],
          changeOnSelect: true,
          ...item?.fieldProps
        }
        break;
      // 位置选择框
      case 'location':
        item.fieldProps = {
          style: { width: 'calc(100% - 32px)' },
          ...item?.fieldProps
        }
        item.afterRender = () => {
          return (
            <>
              <EnvironmentOutlined
                style={{ position: 'absolute', right: 12, top: 5, fontSize: 22 }}
                onClick={() => {
                  let mapProps = {
                    ...item?.mapProps,
                  }
                  if (item.searchText) {
                    const searchText = form?.getFieldValue(item.searchText)
                    const point = form?.getFieldValue(locationName)
                    mapProps = {
                      ...mapProps,
                      ...((searchText && !point) ? { searchText  } : {}),
                      ...(point ? { point } : {}),
                    }
                  }
                  modal({
                    width: 1000,
                    title: '选择地址',
                    content: <FormLocation ref={(ref: any) => locationRef = ref} {...mapProps} />,
                    onOk: () => {
                      if (!locationRef?.coord) {
                        message.error('请先在地图上选择地址！')
                        return false
                      }
                      form?.setFieldsValue({
                        [item.name || '']: locationRef.address,
                        [locationName]: locationRef.coord
                      })
                      return true
                    }
                  })
                }}
              />
            </>
          )
        }
        break;
      // 上传文件框
      case 'upload':
      // 拖拽上传框
      case 'dragger':
        item.fieldProps = {
          onChange: (fileList: any) => {
            form?.setFieldsValue({
              [item?.name || '']: fileList.map((m: any) => m.url).join(',')
            })
          },
          ...item?.fieldProps
        }
        break;
      // 按钮
      case 'button':
        item.labelHidden = true
        item.fieldProps = {
          style: { width: '100%' },
          ...item?.fieldProps
        }
        break;
      // 自定义
      case 'custom':
        item.fieldProps = {
          type: 'hidden',
          ...item?.fieldProps
        }
        break;
      default:
        break;
    }
  }

  // 渲染表单元素
  const renderFormItem = () => {
    return (
      formItems?.map((item: DynamicFormItem) => {
        handleField(item);
        return (
          <Col
            span={item.span || 24}
            key={item.name}
            style={{ position: 'relative' }}
            {...item.colProps}
          >
            {item.beforeRender?.()}
            <FormItem
              label={item.labelHidden ? false : item.label}
              name={item.name}
              rules={buildRules(item)}
              {...item.formItemProps}
            >
              {buildField(item)}
            </FormItem>
            {item.afterRender?.()}
          </Col>
        )
      })
    );
  }

  return (
    <Form form={form} {...formProps}>
      <Row gutter={24}>
        {renderFormItem()}
      </Row>
    </Form>
  )
}

export default forwardRef(DynamicForm)
