import { session } from '@/services/storage'
import request from './request'
import { arrayToObject, arrayToOptions, treeToObject, treeToOptions } from './transform'

// 列表数据处理
export const handleListData = (
  data: any[],
  valueType = 'array',
  ...otherArgs: any[]
) => {
  if (data instanceof Array) {
    if (valueType === 'array') {
      return arrayToOptions(data, ...otherArgs)
    }
    if (valueType === 'object') {
      return arrayToObject(data, ...otherArgs)
    }
    if (valueType === 'treeArray') {
      return treeToOptions(data, ...otherArgs)
    }
    if (valueType === 'treeObject') {
      return treeToObject(data, ...otherArgs)
    }
  }
  return data
}

// 词典缓存/获取
export const dict = (name: string, value?: any) => {
  const hasValue = value !== null && value !== void 0
  const dictValues = session.get('DICT_MAP') || {}
  const dictName = name?.toUpperCase()
  if (hasValue) {
    dictValues[dictName] = value
    session.set('DICT_MAP', dictValues)
  }
  return dictValues[dictName]
}

// 加载行业身份列表
export const loadIndustryList = async (
  setList?: (list: any) => any,
  valueType = 'array'
) => {
  const res: any = await Promise.resolve([
    { label: '纸厂', value: 1 },
    { label: '贸易商', value: 2 },
    { label: '打包站', value: 3 },
    { label: '回收站', value: 4 },
    { label: '回收员', value: 5 },
  ])
  // request('/admin/industry/list', {
  //   method: 'GET',
  // })
  const result = handleListData(res || [], valueType)
  setList?.(result)
  return result
}

// 加载经营领域列表
export const loadBusinessList = async (
  setList?: (list: any) => any,
  valueType = 'array'
) => {
  const res: any = await Promise.resolve([
    { label: '废纸', value: 1 },
    { label: '塑料', value: 2 },
    { label: '金属', value: 3 },
    { label: '废纺', value: 4 },
    { label: '玻璃', value: 5 },
  ])
  // request('/admin/business/list', {
  //   method: 'GET',
  // })
  const result = handleListData(res || [], valueType)
  setList?.(result)
  return result
}

// 加载所属区域列表
export const loadAreaList = async (
  setList?: (list: any) => any,
  valueType = 'array'
) => {
  const res: any = await Promise.resolve([
    { label: '华北', value: '华北' },
    { label: '东北', value: '东北' },
    { label: '华东', value: '华东' },
    { label: '华中', value: '华中' },
    { label: '华南', value: '华南' },
    { label: '西南', value: '西南' },
    { label: '西北', value: '西北' },
  ])
  // request('/admin/area1/list', {
  //   method: 'GET',
  // })
  const result = handleListData(res || [], valueType)
  setList?.(result)
  return result
}

// 加载城市列表
export const loadCityList = async (
  setList?: (list: any) => any,
) => {
  let result = dict('city')
  if (!result?.length) {
    const res: any = await request('/admin/area/list', {
      method: 'GET',
    })
    result = handleListData(res || [], 'treeArray', 'name', 'id')
    dict('city', result)
  }
  setList?.(result)
  return result
}
