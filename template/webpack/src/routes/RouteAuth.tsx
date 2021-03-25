import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect, useHistory } from 'react-router-dom'
import PassportLayout from '@/layouts/PassportLayout'
import UserLayout from '@/layouts/UserLayout'
import PageNotPermission from '@/components/Exception/403'
import PageNotFound from '@/components/Exception/404'
import { getRedirectPath, access, isLogin, loginPath } from '@/access'
import { getArray, getObject, isString, isSame, isNotEmptyArray } from 'phinney-toolkit'
import CustomModal from '@/components/CustomModal'
import { useStore } from '@/hooks'
import { CONFIG } from '@/store/action'
import routes, { RouteProps } from '@/routes'
import config from '@/layouts/config'
import WaterMark from '@/components/WaterMark'

/**
 * 获取路由布局&面包屑对象
 * @param routes 路由列表
 */
export const getConfigMap = (routes: RouteProps[], breadcrumb?: any): Record<string, any> => {
  return routes.reduce((total: Record<string, any>, current: RouteProps) => {
    const { path, ...others } = current
    const newBreadcrumb = [...getArray(breadcrumb), {
      name: others?.name,
      path
    }]

    return {
      ...total,
      ...(path ? {
        [path]: {
          title: others?.name,
          layout: others?.layout || 'user',
          breadcrumb: newBreadcrumb,
        }
      } : {}),
      ...(others?.routes ? getConfigMap(others.routes, newBreadcrumb) : {})
    }
  }, {})
}

/**
 * 获取当前路由布局&面包屑
 */
export const getConfig = (): any => {
  // 路由布局&面包屑对象
  const configMap = getConfigMap(routes)

  // 404时登录及未登录布局
  if (location.pathname === '/404') {
    return {
      title: '页面不存在',
      layout: isLogin() ? 'user' : 'passport',
      breadcrumb: [{ name: '页面不存在', path: '/404' }]
    }
  }

  return configMap[location.pathname]
}

/**
 * 处理路由列表
 * @param routes 路由列表
 * @param level 路由层级
 */
const handleRoutes = (routes: RouteProps[], level = 0): RouteProps[] => {
  return routes.reduce((total: RouteProps[], current: RouteProps, index: number) => {
    const { path, ...others } = current
    // 是否是最后一个路由
    const isLast = index === (getArray(routes).length - 1)
    // 是否含有重定向
    const hasRedirect = isString(path) && !index && level > 0
    // 是否含有404
    const has404 = isString(path) && isLast && level > 0

    return [
      ...total,
      ...(hasRedirect ? [
        {
          from: `/${path?.split('/')?.[1]}`,
          redirect: path,
          exact: true,
        }
      ] : []),
      {
        path,
        ...others,
        exact: !!others.component,
        ...(others?.routes ? { routes: handleRoutes(others.routes, level + 1) } : {})
      },
      ...(has404 ? [
        {
          redirect: '/404',
          exact: true,
        }
      ] : []),
      ...((isLast && !level) ? [
        {
          path: '/404',
          component: PageNotFound,
          hideInMenu: true,
        },
        {
          path: '/',
          component: () => {
            const history = useHistory()
            let path = isLogin() ? getRedirectPath() : loginPath
            if (history.location.pathname !== '/') {
              path = '/404'
            }
            return (
              <Redirect to={path} />
            )
          }
        },
      ] : [])
    ]
  }, [])
}

/**
 * 验证权限组件
 * @param props 路由参数
 */
const AuthComponent = (props: any) => {
  const {
    others,
    component = ({ children }: any) => <>{children}</>,
    routes: childRoutes,
    props: componentProps,
  } = props
  const history = useHistory()
  const { state, dispatch } = useStore(CONFIG)
  const layoutConfig = getConfig()

  // 是否是未登录页面
  const isPassportPage = others?.layout === 'passport'
  // 是否是状态页面
  const isStatusPage = others?.path === '/404'

  // 是否所有权限访问页面
  const Component = access(others) ? component : PageNotPermission

  useEffect(() => {
    // 未登录，进入登录后页面时返回登录页 
    if (
      !isLogin()
      && !isPassportPage
      && !isStatusPage
      && history.location.pathname !== loginPath
      && others.path !== '/'
    ) {
      history.push(loginPath)
      return
    }

    // 路由跳转更新面包屑&布局类型
    if (history.location.pathname === others?.path) {
      document.title = `${layoutConfig?.title} - ${config.title}`
      dispatch(layoutConfig)
    }
  }, [])

  return (
    (isSame(state, layoutConfig) || isNotEmptyArray(childRoutes))
      ? <Component
        children={routesRender(childRoutes)}
        {...componentProps}
      />
      : null
  )
}

/**
 * 递归渲染路由
 * @param routes 路由列表 
 */
const routesRender = (routes?: RouteProps[]) => (
  <Switch>
    {
      routes?.map?.((
        {
          component,
          routes,
          redirect,
          ...others
        }: RouteProps,
        i
      ) => (
        redirect
          ?
          <Redirect
            key={i}
            to={redirect}
            {...others}
          />
          :
          <Route
            key={i}
            render={props => (
              <AuthComponent
                props={props}
                routes={routes}
                others={others}
                component={component}
              />
            )}
            {...others}
          />
      ))
    }
  </Switch>
)

export default () => {
  const { state, dispatch } = useStore(CONFIG)
  const { layout } = getObject(state)

  // 无公共布局
  const NoneLayout = ({ children }: any) => <>{children}</>

  // 公共布局
  const Layout = layout === 'passport' ? PassportLayout : (
    layout === 'user' ? UserLayout : NoneLayout
  )

  // 设置初始布局&面包屑&标题
  useEffect(() => {
    const layoutConfig = getConfig()
    document.title = `${layoutConfig?.title} - ${config.title}`
    dispatch(layoutConfig)
  }, [])

  return (
    <Router>
      <WaterMark content={config.waterMark} gapX= {200} gapY={100}>
        <Layout routes={routes}>
          {routesRender(handleRoutes(routes))}
          <CustomModal />
        </Layout>
      </WaterMark>
    </Router>
  )
}
