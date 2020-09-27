# react-environment-setup
<!-- Badges section here. -->
[![npm](https://img.shields.io/npm/v/react-environment-setup.svg)](https://www.npmjs.com/package/react-environment-setup)
[![npm](https://img.shields.io/npm/dm/react-environment-setup.svg)](https://www.npmjs.com/package/react-environment-setup)
[![Build Status](https://travis-ci.org/phinney001/react-environment-setup.svg?branch=master)](https://travis-ci.org/phinney001/react-environment-setup)

# 简介
`react-environment-setup` 用于React项目自动化创建，依赖于:
+ [Node](https://nodejs.org/en/)
+ [Umi](https://github.com/umijs/umi)
+ [ant-design](https://ant.design/docs/spec/introduce-cn)
+ [ant-design-pro](https://procomponents.ant.design/)

# 环境
  ```bash
  Umi (version >= 3.x)
  Node (version >= 10.x)
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
  + 在项目config目录routes.ts文件添加路由，内容如: 
  ```javascript
  export default [
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
  ]
  ```
  + 运行命令
  ```bash
  res router
  ```