import request from "@/utils/request"

// 获取菜单
export async function queryMenus() {
  return request('/admin/users/menus')
}

// 获取订阅消息
export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}