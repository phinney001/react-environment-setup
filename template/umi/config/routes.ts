import { IRoute } from 'umi'

// 路由列表
const routes: IRoute[] = [
  {
    path: '/passport',
    layout: false,
    component: '../layouts/PassportLayout',
    routes: [
      {
        name: '登录',
        path: '/passport/login',
        component: './Passport/Login',
      },
    ],
  },
  {
    path: '/',
    routes: [
      {
        path: '/kanban',
        name: '看板',
        icon: 'dashboard',
        access: 'isAdmin',
        component: './Kanban',
      },
    ],
  },
]

/**
 * 处理路由列表
 * @param routes 路由列表
 * @param level 路由层级
 */
function handleRoutes(routes: any[], level = 0): any[] {
  return routes.reduce((total: any[], current: any, index: number) => {
    const { path, ...others } = current
    // 是否是最后一个路由
    const isLast = index === routes?.length - 1
    // 是否含有重定向
    const hasRedirect = path && !index && level > 0
    // 是否含有404
    const has404 = path && isLast && level > 0
    // 路径
    const pathArr = path?.split('/')
    pathArr.pop()

    return [
      ...total,
      ...(hasRedirect
        ? [
            {
              path: pathArr.join('/') || '/',
              redirect: path,
            },
          ]
        : []),
      {
        path,
        ...others,
        ...(others?.routes ? { routes: handleRoutes(others.routes, level + 1) } : {}),
      },
      ...(has404
        ? [
            {
              component: './Passport/404',
            },
          ]
        : []),
    ]
  }, [])
}

export default handleRoutes(routes)
