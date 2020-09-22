import React, { useState, useEffect } from 'react'
import { Modal } from 'antd'
import { EventEmitter } from 'events'

const event = new EventEmitter();
export const MODAL_EVENT_NAME = Symbol('MODAL_CREATE')

// 新增弹窗
export function modal(options: any) {
  event.emit(MODAL_EVENT_NAME, options)
}

// 自定义弹窗组件
const CustomModal: React.FC<{}> = () => {
  const [modalList, setModalList] = useState<any>([])

  // 打开弹窗
  const openModal = (options: any) => {
    setModalList((modals: any = []) => {
      if (!options) options = {}
      const { onOk, onCancel } = options
      options.id = `modal_${Date.now()}`
      options.visible = true;
      if (!Reflect.has(options, 'destroyOnClose')) {
        options.destroyOnClose = true
      }
      if (!Reflect.has(options, 'maskClosable')) {
        options.maskClosable = false
      }
      if (!Reflect.has(options, 'width')) {
        options.width = 500
      }
      options.onCancel = async (e: any) => {
        await onCancel?.(e)
        closeModal(options)
      }
      options.onOk = async (e: any) => {
        const bool = await onOk?.(e)
        bool !== false && closeModal(options)
      }
      return [...modals, options]
    })
  }

  // 关闭弹窗
  const closeModal = (options: any = {}) => {
    setModalList((modals: any = []) => {
      return modals.map((item: any) => {
        if (item.id === options.id) {
          return {
            ...item,
            visible: false
          };
        }
        return item
      })
    })
  }

  useEffect(() => {
    event.on(MODAL_EVENT_NAME, openModal)
    return () => {
      event.off(MODAL_EVENT_NAME, openModal)
    }
  }, [])

  return (
    modalList?.map((m: any, mIndex: number) => {
      return (
        <Modal key={mIndex} {...m}>{typeof m.content === 'function' ? m.content() : m.content}</Modal>
      )
    })
  )
}

export default CustomModal
