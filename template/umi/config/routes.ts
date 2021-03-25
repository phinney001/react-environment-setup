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
      { component: './Passport/404' },
    ],
  },
  {
    path: '/',
    routes: [
      { path: '/', redirect: '/home' },
      {
        path: '/home',
        name: '主页',
        icon: 'smile',
        access: 'isAdmin',
        component: './Home',
      },
      { component: './Passport/404' },
    ],
  },
  { component: './Passport/404' },
]