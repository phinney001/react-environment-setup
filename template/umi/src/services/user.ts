import request from "@/utils/request"
import { NoticeIconData } from '@/layouts/UserLayout/GlobalHeaderRight/components/HeaderNotice';

// 获取菜单
export async function queryMenus() {
  // return Promise.resolve([])
  return request('/admin/users/menus')
}

// 获取订阅消息
export async function queryNotices(): Promise<any> {
  return request<{ data: NoticeIconData[] }>('/api/notices');
}
