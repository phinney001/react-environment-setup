const fs = require('fs')
const path = require('path')
const { green } = require('ansi-colors')

class Menu {
  constructor() {
    const fileSuffix = this.isTsProject() ? 'ts' : 'js'
    const routesFileString = `./config/config.${fileSuffix}`
    const localesFilePath = `./src/locales/zh-CN/menu.${fileSuffix}`
    this.routes = this.getRoutesData(routesFileString)
    this.locales = this.getLocalesData(localesFilePath)
  }

  /**
   * 判断项目是否是ts项目
   */
  isTsProject() {
    return fs.existsSync(path.join(process.cwd(), './tsconfig.json'))
  }

  /**
   * 获取菜单路由数据
   * @param {*} filePath 文件路径
   */
  getRoutesData(filePath) {
    const fileString = fs.readFileSync(path.join(process.cwd(), filePath), 'utf-8')
    let objString = fileString.match(/routes: \[([\s\S]*) \],/i)[1]
    objString = `[${objString}]`
    let routesData = eval(objString)
    if (routesData) {
      let mainRoute = routesData.find(f => f.path === '/' && f.routes)
      while(mainRoute) {
        routesData = mainRoute.routes
        mainRoute = routesData.find(f => f.path === '/' && f.routes)
      }
    }
    return routesData.filter(f => f.path && f.name)
  }

  /**
   * 获取菜单国际化数据
   * @param {*} filePath 文件路径
   */
  getLocalesData(filePath) {
    const fileString = fs.readFileSync(path.join(process.cwd(), filePath), 'utf-8')
    const firstIndex = fileString.indexOf('export default ') + 15
    const lastIndex = fileString.lastIndexOf('}') + 1
    let objString = fileString.substring(firstIndex, lastIndex)
    objString = `[${objString}]`
    return eval(objString)[0]
  }

  /**
   * 递归处理路由数据
   * @param {*} routes 路由数据
   */
  recursion(routes) {
    if (routes instanceof Array) {
      return routes.map(item => {
        const parentUrlArray = item.path.split('/')
        parentUrlArray.pop()
        const locale = `menu${parentUrlArray.join('.')}.${item.name}`
        return {
          path: item.path,
          name: item.name,
          desc: this.locales[locale],
          locale,
          ...(item.icon ? { icon: item.icon } : {}),
          ...(item.component ? { component: item.component } : {}),
          ...(item.routes ? { children: this.recursion(item.routes) } : {}),
          ...((!item.routes || !item.routes.length) ? { resource: item.resource || item.name } : {}),
        }
      })
    }
    return routes
  }

  /**
   * 运行
   */
  start() {
    console.log(green('菜单json文件生成中...'))
    fs.writeFileSync('menu.json', JSON.stringify(this.recursion(this.routes)), 'utf-8')
    console.log(green('菜单json文件生成成功！'))
  }
}

module.exports = Menu
