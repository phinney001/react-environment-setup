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
  // return Promise.resolve({
  //   token: 'HFGJKSHDKGHPOJDS345H26HK4H6K5H7545460974296',
  // })
  return request('/api/admin/v1/auth/login', {
    method: 'POST',
    data: params,
  });
}

// 获取验证码
export async function getCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

// 退出登录
export async function logout() {
  return request('/api/logout');
}