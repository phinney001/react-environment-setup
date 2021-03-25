import { message, Tabs, FormInstance } from 'antd'
import React, { useEffect, useState } from 'react'
import DynamicForm, { DynamicFormItem } from '@/components/DynamicForm'
import { UserOutlined, LockTwoTone, MobileTwoTone, MailTwoTone } from '@ant-design/icons'
import { treeToObject } from 'phinney-toolkit'
import { useHistory } from 'react-router-dom'
import { getRedirectPath, setMenus, setUserInfo } from '@/access'
import styles from './index.module.less'
import { login, queryMenus } from './service'

export default () => {
  // 组件是否已经卸载
  let isUnMounted = false
  // 登录方式选中项
  const [tabActive, setTabActive] = useState('1')
  // 登录loading
  const [submitLoading, setSubmitLoading] = useState(false)
  // 路由实例
  const history = useHistory()

  // 登录提交
  const submit = async (form: FormInstance) => {
    if (form) {
      try {
        !isUnMounted && setSubmitLoading(true)

        const values: any = await form.validateFields()
        const res = await login(values)

        if (res?.access_token) {
          setUserInfo({
            username: values.username,
            ...res
          })

          // 获取菜单
          const menuRes = await queryMenus()
          setMenus(treeToObject(menuRes, {
            value: 'path',
            handleValue: () => true
          }))

          message.success('登录成功！')
          !isUnMounted && setSubmitLoading(false)

          // 跳转首页
          history.push(getRedirectPath())
        }
      } catch { }

      !isUnMounted && setSubmitLoading(false)
    }
  }

  // 表单项
  const formItems: DynamicFormItem[] = [
    ...(tabActive === '1'
      ? [
        {
          type: 'text',
          name: 'username',
          label: '账号',
          labelHidden: true,
          required: true,
          fieldProps: {
            size: 'large',
            onEnter: submit,
            prefix: <UserOutlined className={styles.loginIcon} style={{ color: '#1890ff' }} />,
          }
        },
        {
          type: 'password',
          name: 'password',
          label: '密码',
          labelHidden: true,
          required: true,
          fieldProps: {
            size: 'large',
            onEnter: submit,
            prefix: <LockTwoTone className={styles.loginIcon} />,
          }
        },
      ]
      : [
        {
          type: 'phone',
          name: 'mobile',
          label: '手机号',
          labelHidden: true,
          required: true,
          fieldProps: {
            size: 'large',
            onEnter: submit,
            prefix: <MobileTwoTone className={styles.loginIcon} />,
          }
        },
        {
          type: 'captcha',
          name: 'captcha',
          label: '验证码',
          labelHidden: true,
          required: true,
          getCaptcha: async () => {
            message.success('获取验证码成功！')
            return true
          },
          fieldProps: {
            size: 'large',
            onEnter: submit,
            prefix: <MailTwoTone className={styles.loginIcon} />,
          }
        },
      ]),

    {
      type: 'button',
      name: 'submit',
      label: '登录',
      fieldProps: {
        size: 'large',
        type: 'primary',
        onClick: submit,
        loading: submitLoading,
        style: { marginTop: 24, width: '100%' },
      }
    },
  ]

  // 初始化加载数据
  useEffect(() => {
    return () => {
      isUnMounted = true
    }
  }, [])

  return (
    <div className={styles.loginContainer}>
      <Tabs
        destroyInactiveTabPane
        animated={false}
        activeKey={tabActive}
        onChange={(activeKey) => {
          !isUnMounted && setTabActive(activeKey)
        }}
      >
        <Tabs.TabPane tab="账户密码登录" key="1"></Tabs.TabPane>
        <Tabs.TabPane tab="手机号登录" key="2"></Tabs.TabPane>
      </Tabs>
      <DynamicForm formItems={formItems} />
    </div>
  )
}
