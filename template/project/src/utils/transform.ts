
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
