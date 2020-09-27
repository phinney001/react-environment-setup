
// 对象数组转对象（用户表格过滤下拉框）
export const arrayToObject = (
  arr: any[],
  label = 'label',
  value = 'value',
): any => {
  return arr?.reduce((t: any, c: any) => {
    return {
      ...t,
      [c[value]]: c[label]
    }
  }, {})
}

// 对象数组数据转换为下拉框使用数据
export const arrayToOptions = (
  arr: any[],
  label = 'label',
  value = 'value',
  hasAll = false,
): any => {
  return arr?.map((m: any) => ({
    ...(hasAll ? m : {}),
    label: m[label],
    value: m[value]
  }))
}

// 树形数组转对象（用户表格过滤下拉框）
export const treeToObject = (
  arr: any[],
  label = 'label',
  value = 'value',
  children = 'children',
  name = '',
  linker: string | boolean = '/',
): any => {
  return arr?.reduce((t: any, c: any) => {
    const newLabel = name + c[label]
    return {
      ...t,
      [c[value]]: linker === false ? c[label] : newLabel,
      ...(c.children instanceof Array
        ? treeToObject(c[children], label, value, children, newLabel + linker, linker)
        : {})
    }
  }, {})
}

// 树形数组数据转换为下拉框使用数据
export const treeToOptions = (
  arr: any[],
  label = 'label',
  value = 'value',
  children = 'children',
  hasAll = false,
): any => {
  return arr?.reduce((t: any, c: any) => {
    return [
      ...t,
      {
        ...(hasAll ? c : {}),
        value: c[value],
        label: c[label],
        children: c[children] instanceof Array
          ? treeToOptions(c[children], label, value, children, hasAll)
          : null
      },
    ]
  }, [])
}

// 树形数组转经纬度对象（用户表格过滤下拉框）
export const treeToCoordObject = (
  arr: any[],
  label = ['lat', 'lng'],
  value = 'value',
  children = 'children',
): any => {
  return arr?.reduce((t: any, c: any) => {
    return {
      ...t,
      [c[value]]: {
        lat: c[label[0]],
        lng: c[label[1]],
      },
      ...(c.children instanceof Array
        ? treeToCoordObject(c[children], label, value, children)
        : {})
    }
  }, {})
}

// 经纬度转换-腾讯地图转百度地图
export const QMapTransBMap = (lng: number, lat: number) => {
  if (!lng || !lat) return { lng, lat }
  const x = parseFloat(lng.toString())
  const y = parseFloat(lat.toString())
  const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * Math.PI)
  const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * Math.PI)

  return {
    lng: (z * Math.cos(theta) + 0.0065).toFixed(5),
    lat: (z * Math.sin(theta) + 0.006).toFixed(5)
  }
}

// 经纬度转换-百度地图转腾讯地图
export const BMapTransQMap = (lng: number, lat: number) => {
  if (!lng || !lat) return { lng, lat }
  const x = parseFloat(lng.toString()) - 0.0065
  const y = parseFloat(lat.toString()) - 0.006
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * Math.PI)
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * Math.PI)

  return {
    lng: (z * Math.cos(theta)).toFixed(7),
    lat: (z * Math.sin(theta)).toFixed(7)
  }
}