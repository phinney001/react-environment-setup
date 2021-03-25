import { getUserName, isAdmin, getRedirectPath, setUserInfo, setMenus } from '@/access';
import DynamicForm, { DynamicFormItem } from '@/components/DynamicForm';
import { login } from '@/services/login';
import { queryMenus } from '@/services/user';
import { LockTwoTone, MailTwoTone, MobileTwoTone, UserOutlined } from '@ant-design/icons';
import { message, Tabs } from 'antd';
import { FormInstance } from 'antd/lib/form';
import React, { useState } from 'react';
import { history, useModel } from 'umi';

import styles from './index.less';

const { TabPane } = Tabs;

const Login: React.FC<any> = () => {
  // 登录方式选中项
  const [tabActive, setTabActive] = useState('1');
  // 登录loading
  const [submitLoading, setSubmitLoading] = useState(false);
  // 全局初始数据
  const { setInitialState } = useModel('@@initialState');

  // 登录提交
  const submit = async (form: FormInstance) => {
    if (form) {
      try {
        const values: any = await form.validateFields();
        setSubmitLoading(true);
        const res = await login(values);
        if (res?.access_token) {
          setUserInfo({
            username: values.username,
            ...res,
          });
          const menuRes = await queryMenus();
          setInitialState({
            username: getUserName(),
            isAdmin: isAdmin(),
          });
          setMenus(menuRes?.menus);
          message.success('登录成功！');
          setSubmitLoading(false);
          history.push(getRedirectPath());
        } else {
          setSubmitLoading(false);
        }
      } catch {
        setSubmitLoading(false);
      }
    }
  };

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
          },
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
          },
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
          },
        },
        {
          type: 'captcha',
          name: 'captcha',
          label: '验证码',
          labelHidden: true,
          required: true,
          getCaptcha: async () => {
            message.success('获取验证码成功！');
            return true;
          },
          fieldProps: {
            size: 'large',
            onEnter: submit,
            prefix: <MailTwoTone className={styles.loginIcon} />,
          },
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
      },
    },
  ];

  return (
    <div className={styles.loginContainer}>
      <Tabs
        destroyInactiveTabPane
        animated={false}
        activeKey={tabActive}
        onChange={(activeKey) => {
          setTabActive(activeKey);
        }}
      >
        <TabPane tab="账户密码登录" key="1"></TabPane>
        <TabPane tab="手机号登录" key="2"></TabPane>
      </Tabs>
      <DynamicForm formItems={formItems} />
    </div>
  );
};

export default Login;