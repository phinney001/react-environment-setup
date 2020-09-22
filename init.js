const fs = require('fs')
const path = require('path')
const { prompt } = require('inquirer')
const { yellow, green } = require('ansi-colors')
const Router = require('./router.js')
const Common = require('./common.js')

class ReactCli extends Common {

  constructor() {
    super()
    // 命令问题列表
    this.promptList = [
      {
        name: 'project-name-en',
        type: 'input',
        message: '请输入项目英文名称：'
      },
      {
        name: 'project-name-cn',
        type: 'input',
        message: '请输入项目中文名称：'
      },
      // {
      //   name: 'library-select',
      //   type: 'list',
      //   message: '请选择需要安装的第三方：',
      //   choices: [
      //     { name: '全部', value: 'both' },
      //     { name: 'ngx-echarts', value: 'echart' },
      //     { name: 'ng-zorro-antd', value: 'antd' }
      //   ]
      // },
      // {
      //   name: 'library-select',
      //   type: 'list',
      //   message: '请选择需要使用的服务：',
      //   choices: [
      //     { name: '全部', value: 'both' },
      //     { name: '请求拦截器', value: 'ajax' },
      //     { name: '词典服务', value: 'dict' },
      //     { name: '路由守卫', value: 'guard' }
      //   ]
      // },
    ]
  }

  /**
   * 初始化
   * @param {string} projectName 当前项目名称
   */
  async init(projectName) {
    const answers = await prompt(
      this.promptList.filter(f => !projectName || f.name !== 'project-name-en')
    )
    if (!projectName) projectName = answers['project-name-en']
    const projectPath = `${process.cwd()}/${projectName}`
    if (fs.existsSync(projectPath)) {
      console.log(yellow(`${projectPath} already exists.`))
    } else {
      this.copyDir('./template/project', projectPath)
    }
  }

  /**
   * 安装环境
   */
  start() {
    let projectName = Array.from(process.argv).slice(2).join(' ')
    if (projectName) {
      if (projectName === 'router') {
        const router = new Router()
        router.start()
      } else {
        this.init(projectName)
      }
    } else {
      prompt(this.promptList).then(answers => {
        projectName = answers['project-name-en']
        this.init(projectName)
      })
    }
  }
}

const RC = new ReactCli()
RC.start()
