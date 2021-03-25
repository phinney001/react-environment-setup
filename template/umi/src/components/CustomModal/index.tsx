import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { EventEmitter } from 'events';

const event = new EventEmitter();
export const MODAL_EVENT_NAME = Symbol('MODAL_CREATE');

// 新增弹窗
export function modal(options: any) {
  const proxyOptions = new Proxy(options, {
    set: (target, propKey, value, receiver) => {
      proxyOptions?.update?.({
        [propKey]: value,
      });
      return Reflect.set(target, propKey, value, receiver);
    },
  });
  event.emit(MODAL_EVENT_NAME, proxyOptions);
  return proxyOptions;
}

// 自定义弹窗组件
const CustomModal: React.FC<any> = () => {
  // 组件是否已经卸载
  let isUnMounted = false;
  // 弹窗列表
  const [modalList, setModalList] = useState<any>([]);

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
              });
            }
          }
          return item;
        });
      });
  };

  // 关闭弹窗
  const closeModal = (options: any = {}) => {
    !isUnMounted &&
      setModalList((modals: any = []) => {
        return modals.map((item: any) => {
          if (item.id === options.id) {
            return {
              ...item,
              visible: false,
            };
          }
          return item;
        });
      });
  };

  // 获取初始化配置
  function getOptions(options: any) {
    options.origin = { ...options };
    if (!options) options = {};
    const { onOk, onCancel } = options;
    if (!Reflect.has(options, 'id')) {
      options.id = `modal_${Date.now()}`;
    }
    if (!Reflect.has(options, 'visible')) {
      options.visible = true;
    }
    if (!Reflect.has(options, 'destroyOnClose')) {
      options.destroyOnClose = true;
    }
    if (!Reflect.has(options, 'maskClosable')) {
      options.maskClosable = false;
    }
    if (!Reflect.has(options, 'width')) {
      options.width = 500;
    }
    // 取消
    options.onCancel = async (e: any) => {
      const bool = await onCancel?.(e, (props: any) => {
        updateProps(options.id, props);
      });
      bool !== false && closeModal(options);
    };
    // 提交
    options.onOk = async (e: any) => {
      const bool = await onOk?.(e, (props: any) => {
        updateProps(options.id, props);
      });
      bool !== false && closeModal(options);
    };
    // 弹窗关闭事件
    options.close = () => {
      closeModal(options);
    };
    // 更新弹窗props
    options.update = (props: any) => {
      updateProps(options.id, props);
    };
    return options;
  }

  // 打开弹窗
  const openModal = (options: any) => {
    !isUnMounted &&
      setModalList((modals: any = []) => {
        return [...modals, getOptions(options)];
      });
  };

  useEffect(() => {
    event.on(MODAL_EVENT_NAME, openModal);
    return () => {
      isUnMounted = true;
      event.off(MODAL_EVENT_NAME, openModal);
    };
  }, []);

  return modalList?.map((m: any, mIndex: number) => {
    return (
      <Modal key={mIndex} {...m}>
        {typeof m.content === 'function'
          ? m.content((props: any) => {
            updateProps(m.id, props);
          })
          : m.content}
      </Modal>
    );
  });
};

export default CustomModal;