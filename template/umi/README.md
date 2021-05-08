# PROJECTNAME

## 安装依赖

```
npm install
```

## 开发模式运行

```
npm run dev
```

or

```
npm run start
```

## 编译项目

```
npm run build
```

## 运行编译后项目

```
npm run serve
```

## 环境和依赖
- [Node](https://nodejs.org/en)
- [Umi](https://umijs.org/zh-CN)
- [React](https://zh-hans.reactjs.org)
- [Ant-Design](https://ant.design/docs/spec/introduce-cn)
- [Ant-Design-Pro](https://procomponents.ant.design)

## 目录结构
- config `公共配置`
  - config.dev.ts `开发环境专用配置`
  - config.ts `环境配置`
  - defaultSettings.ts `公共主题配置`
  - proxy.ts `反向代理配置`
  - routes.ts `路由配置`
- mock `mock数据`
- public `页面图标`
- src
  - .umi `umi缓存目录`
  - assets `资源存放`
  - components `组件存放`
    - CustomModal `自定义弹窗组件及方法`
    - DynamicForm `动态表单组件`
    - FilterForm `过滤表单组件`
    - IntegrationTable `一体化表格组件`
  - e2e `e2e测试代码`
  - hooks `自定义钩子函数`
  - layouts `公共布局`
    - PassportLayout `未登录公共布局`
    - UserLayout `登录后公共布局`
    - config.ts `公共配置常量`
  - locales `国际化语言包`
  - pages `页面组件`
    - document.ejs `网页入口模板`
  - utils `工具包`
    - chart.ts `echarts图表快捷方法`
    - dict.ts `公共词典`
    - request.ts `公共请求服务`
    - utils.ts `工具包`
  - access.ts `用户权限验证`
  - app.tsx `入口文件`
  - global.less `公共样式`
  - global.tsx `pwa`
  - typings.d.ts `ts类型扩展文件`
- .eslintrc.js `tslint配置文件`
- .prettierrc.js `提交格式化配置文件`
- .stylelintrc.js `提交格式化样式配置文件`
- tsconfig.json `typescript配置`
