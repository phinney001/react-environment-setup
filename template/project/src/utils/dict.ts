import { session, transitData, isArray, isNotNullOrUndefined } from 'phinney-toolkit'
import request from './request'
import moment from 'moment'

// 词典缓存/获取
export const dict = (name: string, value?: any) => {
  const hasValue = isNotNullOrUndefined(value);
  const dictValues = session.get('DICT_MAP') || {};
  const dictName = name?.toUpperCase();
  if (hasValue) {
    dictValues[dictName] = value;
    session.set('DICT_MAP', dictValues);
  }
  return dictValues[dictName]
}

// 加载状态列表
export const loadStausList = async (
  setList?: (list: any) => any,
  valueType = 'array'
) => {
  const res: any = await Promise.resolve([
    { label: '是', value: 1 },
    { label: '否', value: 2 },
  ])
  // request('/admin/staus/list', {
  //   method: 'GET',
  // })
  const result = transitData(res, valueType)
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
    result = transitData(res, 'treeArray', {
      label: 'name',
      value: 'id'
    })
    const cityCorrd = transitData(res, 'treeObject', {
      value: 'id',
      handleValue: (c: any) => {
        return {
          lat: c.lat,
          lng: c.lng
        }
      }
    })
    dict('cityCoord', cityCorrd)
    dict('city', result)
  }
  setList?.(result)
  return result
}

// 加载城市经纬度列表
export const loadCityCoordList = async (
  setList?: (list: any) => any,
) => {
  let result = dict('cityCoord')
  if (!result) {
    await loadCityList()
    result = dict('cityCoord')
  }
  setList?.(result)
  return result
}

// 获取开始结束时间对象
export const getStartEndTime = (times: any[], start = 'startTime', end = 'endTime') => {
  if (isArray(times) && times.length === 2) {
    return {
      [start]: `${moment(times[0]).format('YYYY-MM-DD')} 00:00:00`,
      [end]: `${moment(times[1]).format('YYYY-MM-DD')} 23:59:59`,
    };
  }
  return {};
};
