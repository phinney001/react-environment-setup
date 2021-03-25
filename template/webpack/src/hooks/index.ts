import { useContext, useRef } from 'react'
import { StoreContext } from '@/store'

/**
 * 获取store数据
 * @param key 存储数据key
 */
export function useStore(key?: symbol) {
  const { state, dispatch } = useContext<{
    state?: any
    dispatch: (
      data: {
        type: symbol,
        payload?: any
      }
    ) => void
  }>(StoreContext)

  if (key) {
    return {
      state: state[key],
      dispatch: (payload: any) => {
        dispatch({
          type: key,
          payload
        })
      }
    }
  }
  return { state, dispatch }
}


/**
 * 节流
 * @param fn 函数
 * @param delay 节流时间
 * @returns Function
 */
export function useThrottle(fn: Function, delay: number): () => void {
  const { current } = useRef<any>({})

  return function (...args) {
    if (!current.timer) {
      current.timer = setTimeout(() => {
        clearTimeout(current.timer)
        Reflect.deleteProperty(current, 'timer')
      }, delay)

      fn(...args)
    }
  }
}

/**
 * 防抖
 * @param fn 函数
 * @param delay 防抖时间
 * @returns Function
 */
export function useDebounce(fn: Function, delay: number): () => void {
  const { current } = useRef<any>({})

  return function (...args) {
    if (current.timer) {
      clearTimeout(current.timer)
    }

    current.timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
