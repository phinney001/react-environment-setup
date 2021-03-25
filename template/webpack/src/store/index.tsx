import { isSame } from 'phinney-toolkit'
import React, { createContext, useReducer } from 'react'
import StoreState from './state'

// 生成context
export const StoreContext: any = createContext(StoreState)

/**
 * store服务
 * @param children 子元素
 */
export function StoreProvider({ children }: any) {
  // 设置reducer，得到dispatch方法和state
  const [state, dispatch] = useReducer((
    state = StoreState,
    action: any
  ) => {
    const { type, payload } = action
    // 如果跟现在存储值相同返回
    if (isSame(state[type], payload)) {
      return state
    }
    return type ? {
      ...state,
      [type]: payload
    } : state
  }, StoreState)

  // 渲染state，dispatch
  return (
    <StoreContext.Provider value={{
      state,
      dispatch,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

