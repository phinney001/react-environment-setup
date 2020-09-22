import { request } from 'umi';

export interface LoginParamsType {
  account?: string;
  password?: string;
  mobile?: string;
  captcha?: string;
  submit: any;
}

// 登录
export async function login(params: LoginParamsType) {
  return request('/admin/auth/login-by-password', {
    method: 'POST',
    data: params,
  })
}

// 获取验证码
export async function getCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

// 退出登录
export async function logout() {
  return request('/api/logout');
}
