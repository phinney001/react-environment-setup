import request from "@/utils/request"

// 更改用户状态
export async function changeUserStatus(data: any) {
  return Promise.resolve(true)
  // return request('/admin/user/status', {
  //   method: 'POST',
  //   data
  // })
}
