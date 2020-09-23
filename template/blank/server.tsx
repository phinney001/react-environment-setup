import request from '@/utils/request'

// 更改状态
export async function changeStatus(data: any) {
  return request('/url', {
    method: 'POST',
    data
  })
}
