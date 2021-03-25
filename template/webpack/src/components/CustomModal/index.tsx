import React, { useState, useEffect, ReactElement, isValidElement } from 'react'
import { Modal, ModalProps } from 'antd'
import { EventEmitter } from 'events'

const event = new EventEmitter()
// 新增弹窗事件名称
export const MODAL_EVENT_NAME = 'MODAL_CREATE'

/**
 * 弹窗配置
 * @param id 弹窗ID
 * @param origin 弹窗原始数据
 * @param content 弹窗内容
 */
export interface CustomModalProps extends ModalProps {
  id?: string,
  origin?: string,
  content?: {
    state?: Record<string, any>
    onInit?: (vm: any) => void,
    render?: (vm: any, getModalRef: () => any) => any
  } | ((vm: any) => ReactElement) | ReactElement
  [key: string]: any
}

// 新增弹窗
export function modal(options: CustomModalProps) {
  event.emit(MODAL_EVENT_NAME, options)
  return options
}

// 获取组件
export function getComponent(props: any) {
  let { state, onInit, render } = props || {}
  class Component extends React.Component {
    state = {
      ...state
    }
    componentDidMount() {
      onInit?.(this)
    }
    render() {
      return (typeof props === 'function' ? props(this) : render?.(this)) || <></>
    }
  }
  return Component
}

// 自定义弹窗组件
const CustomModal = () => {
  // 组件是否已经卸载
  let isUnMounted = false
  // 弹窗列表
  const [modalList, setModalList] = useState<any>([])

  // 更新props
  const updateProps = (id: string, props?: any) => {
    !isUnMounted &&
      setModalList((modals: any = []) => {
        return modals.map((item: any) => {
          if (item.id === id) {
            if (props && Object.keys(props)?.length) {
              return getOptions({
                ...item.origin,
                ...props,
                id,
              })
            }
          }
          return item
        })
      })
  }

  // 关闭弹窗
  const closeModal = (options: any = {}) => {
    !isUnMounted &&
      setModalList((modals: any = []) => {
        return modals.map((item: any) => {
          if (item.id === options.id) {
            return {
              ...item,
              visible: false,
            }
          }
          return item
        })
      })
    setTimeout(() => {
      !isUnMounted &&
        setModalList((modals: any = []) => {
          return modals.filter((item: any) => {
            return item.id !== options.id
          })
        })
    }, 200)
  }

  // 获取初始化配置
  function getOptions(options: any) {
    options.origin = { ...options }
    if (!options) options = {}
    const { onOk, onCancel } = options
    if (!Reflect.has(options, 'id')) {
      options.id = `modal_${Date.now()}`
    }
    if (!Reflect.has(options, 'visible')) {
      options.visible = true
    }
    if (!Reflect.has(options, 'destroyOnClose')) {
      options.destroyOnClose = true
    }
    if (!Reflect.has(options, 'maskClosable')) {
      options.maskClosable = false
    }
    if (!Reflect.has(options, 'width')) {
      options.width = 500
    }
    // 取消
    options.onCancel = async (e: any) => {
      const bool = await onCancel?.(e, (props: any) => {
        updateProps(options.id, props)
      })
      bool !== false && closeModal(options)
    }
    // 提交
    options.onOk = async (e: any) => {
      const bool = await onOk?.(e, (props: any) => {
        updateProps(options.id, props)
      })
      bool !== false && closeModal(options)
    }
    // 弹窗关闭事件
    options.close = () => {
      closeModal(options)
    }
    // 更新弹窗props
    options.update = (props: any) => {
      updateProps(options.id, props)
    }
    return options
  }

  // 打开弹窗
  const openModal = (options: any) => {
    !isUnMounted &&
      setModalList((modals: any = []) => {
        return [...modals, getOptions(options)]
      })
  }

  useEffect(() => {
    event.on(MODAL_EVENT_NAME, openModal)
    return () => {
      isUnMounted = true
      event.off(MODAL_EVENT_NAME, openModal)
    }
  }, [])

  return modalList?.map((m: any, mIndex: number) => {
    const Content = isValidElement(m.content)
      ? () => m.content
      : getComponent(m.content)

    return (
      <Modal key={mIndex} {...m}>
        <Content />
      </Modal>
    )
  })
}

export default CustomModal
