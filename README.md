# react-environment-setup
<!-- Badges section here. -->
[![npm](https://img.shields.io/npm/v/react-environment-setup.svg)](https://www.npmjs.com/package/react-environment-setup)
[![npm](https://img.shields.io/npm/dm/react-environment-setup.svg)](https://www.npmjs.com/package/react-environment-setup)
[![Build Status](https://travis-ci.org/phinney001/react-environment-setup.svg?branch=master)](https://travis-ci.org/phinney001/react-environment-setup)

# 简介
`react-environment-setup` 用于React项目自动化创建，依赖于:
+ [Node](https://nodejs.org/en)
+ [Umi](https://umijs.org/zh-CN)
+ [Vite](https://cn.vitejs.dev)
+ [Webpack](https://webpack.docschina.org/concepts)
+ [ant-design](https://ant.design/docs/spec/introduce-cn)
+ [ant-design-pro](https://procomponents.ant.design)

# 环境
  ```bash
  Node (version >= 14.x)
  ```

# 安装
  ```bash
  npm install react-environment-setup -g
  ```

# 运行
  ```bash
  res
  ```
# 生成路由
  + vite项目、webpack项目路由文件路径：src/routes/index.tsx
  + umi项目路由文件路径：config/routes.ts
  + 自定义路由文件路径：使用package.json中routes字段指向路由文件路径
  + 自定义配置模版目录：使用package.json中template字段指向模版目录，目录下必须存在三个文件：index.tsx、table.tsx、service.tsx
  + 在路由文件中添加路由，内容如: 
  ```javascript
  {
    path: '/parent',
    name: '父级路由中文名称',
    icon: 'smile',
    routes: [
      {
        path: '/parent/child',
        name: '子级路由中文名称',
        component: './Parent/Child',
        table: true, // 是否是一体化表格组件
        service: true, // 是否添加service文件
        cover: true, // 已有文件是否覆盖
      }
    ]
  }
  ```
  + 运行命令
  ```bash
  res router
  ```
# 生成菜单
  + 运行命令
  ```bash
  res menu
  ```
