export default [
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
    access: 'canAccess',
    routes: [
      {
        path: '/home',
        name: '主页',
        icon: 'smile',
        component: './Home',
      },
      { path: '/', redirect: '/home' },
      { component: './Passport/404' },
    ],
  },
  { component: './Passport/404' },
]