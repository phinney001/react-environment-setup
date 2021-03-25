import { history } from 'umi';
import { session } from 'phinney-toolkit';

export interface UserInfo {
  access_token?: string;
  username?: string;
  roles?: string[];
}

// 登录地址
export const loginPath = '/passport/login'
// 登录后跳转地址
export const redirectPath = '/home'

// 获取登录后跳转地址
export function getRedirectPath() {
  if (isAdmin()) {
    return '/home'
  }
  return redirectPath
}

// 获取用户token
export function getToken(isOrigin?: boolean) {
  const token = getUserInfo()?.access_token;
  return isOrigin ? token : token && `Bearer ${token}`;
}

// 设置用户信息
export function setUserInfo(currentUser: UserInfo) {
  session.set('userinfo', currentUser);
}

// 获取用户信息
export function getUserInfo() {
  return session.get('userinfo');
}

// 设置菜单信息
export function setMenus(menus: any) {
  session.set('menus', menus)
}

// 获取菜单信息
export function getMenus() {
  return session.get('menus')
}

// 获取用户名
export function getUserName() {
  return getUserInfo()?.username;
}

// 是否是admin
export function isAdmin() {
  return Boolean(getUserInfo()?.roles?.includes('ADMIN'));
}



// 跳转登录页
export function toLogin() {
  // 清除缓存
  session.clear();
  history.replace({
    pathname: loginPath,
  });
}
// 是否已经登录
export function isLogin() {
  return !!getToken();
}

// 路由权限验证
export default function (initialState: any = {}) {
  return {
    isAdmin: () => initialState?.isAdmin
  };
}

