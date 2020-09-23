const fs = require('fs')
const { red } = require('ansi-colors')

class Router {

  /**
   * 英文字符串首字母大写
   * @param {*} str 英文字符串 
   * @returns {string}
   */
  getFirstLetterUpper(str) {
    if (this.isString(str) && str[0]) {
      return str[0].toUpperCase() + str.substr(1)
    }
    return ''
  }

  /**
   * 生成路由组件
   * @param {string} moduleName 模块名称
   * @param {string} routerList 路由列表
   * @param {string} routePath 路由组件路径
   */
  generateRoute(routerList, routePath) {
    routerList.forEach(item => {
      const newRoutePath = item.component ? path.join(routePath, item.component) : routePath
      if (item.component) {
        const newRouteComponentPath = path.join(newRoutePath, 'index.tsx')
        const newRouteServicePath = path.join(newRoutePath, 'service.tsx')

        // 是否覆盖组件文件
        if (fs.existsSync(newRouteComponentPath) && !item.cover) {
          // 获取空白组件字符串
          let componentString = fs.readFileSync('./template/blank/index.tsx', 'utf-8')
          // 是否是表格类组件
          if (item.table) {
            componentString = fs.readFileSync('./template/blank/table.tsx', 'utf-8')
          }
          componentString = componentString.replace(/HEADERTITLE/g, item.name)
            .replace(/COMPONENT/g, item.component.split('/').pop())
          fs.writeFileSync(path.join(newRoutePath, 'index.tsx'), componentString, 'utf-8')
        }

        // 是否覆盖service文件
        if (fs.existsSync(newRouteServicePath) && !item.cover) {
          // 是否添加service
          if (item.service) {
            fs.writeFileSync(
              path.join(newRoutePath, 'service.tsx'),
              fs.readFileSync('./template/blank/service.tsx', 'utf-8'),
              'utf-8'
            )
          }
        }
      }
      // 如果有子级路由递归
      if (item.routes && item.routes.length) {
        this.generateRoute(item.routes, newRoutePath)
      }
    })
  }

  /**
   * 生成路由命令
   */
  start() {
    // 路由文件路径
    const routerPath = `${process.cwd()}/config/routes.ts`
    if (fs.existsSync(routerPath)) {
      // 获取路由列表
      let routerListString = fs.readFileSync(routerPath, 'utf-8')
      routerListString = routerListString.replace('export default ', '')
      const routerList = eval(routerListString)
      // 路由生成路径
      const routeBasePath = `${process.cwd()}/src/app/pages`
      // 生成路由
      this.generateRoute(routerList, routeBasePath)
    } else {
      console.log(red(`${routerPath} must exists.`))
    }
  }
}

module.exports = Router
