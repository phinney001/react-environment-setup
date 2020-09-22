import { parse } from 'querystring';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

// 获取页面参数
export const getPageQuery = () => {
  const { href } = window.location;
  const qsIndex = href.indexOf('?');
  const sharpIndex = href.indexOf('#');

  if (qsIndex !== -1) {
    if (qsIndex > sharpIndex) {
      return parse(href.split('?')[1]);
    }

    return parse(href.slice(qsIndex + 1, sharpIndex));
  }

  return {};
}

// 是否含有某个子节点
export const hasChild = (list: any[], value: any, valueName = 'value', childrenName = 'children'): boolean => {
  if (list instanceof Array) {
    return list.some((s: any) => {
      if (s[valueName] !== value && s[childrenName]) {
        return hasChild(s[childrenName], value);
      }
      return s[valueName] === value
    })
  }
  return false;
}

// 根据子节点id获取含有父级节点id列表
export const getValueListByChildId = (list: any[], value: any, valueName = 'value', childrenName = 'children'): any[] => {
  if (list instanceof Array) {
    return list.reduce((t, c) => {
      if (c[valueName] === value || hasChild(c[childrenName], value)) {
        return [
          ...t,
          c[valueName],
          ...(getValueListByChildId(c[childrenName], value, valueName, childrenName))
        ];
      }
      return t;
    }, [])
  }
  return [];
}
