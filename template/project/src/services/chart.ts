import { precision } from '@/utils/unit';

export class ChartService {

  constructor(
  ) { }

  // 图例
  public legend = {
    // 公共图例配置
    common: {
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 10,
      textStyle: {
        fontSize: 12,
        padding: [3, 0, 0, 3],
        color: '#545454'
      }
    },
    // 图例居上
    top: {
      top: 10
    },
    // 图例居下
    bottom: {
      bottom: 10
    },
    // 图例居左
    left: {
      top: 50,
      left: 20,
      orient: 'vertical',
    },
    // 图例居右
    right: {
      top: 50,
      right: 20,
      orient: 'vertical',
    },
    // 折线图图例图标
    // tslint:disable-next-line
    line: 'path://M960 470.857143H64c-5.028571 0-9.142857 4.114286-9.142857 9.142857v64c0 5.028571 4.114286 9.142857 9.142857 9.142857h896c5.028571 0 9.142857-4.114286 9.142857-9.142857v-64c0-5.028571-4.114286-9.142857-9.142857-9.142857z',
    // 柱状图图例图标
    bar: 'path://M1024 1024H0V0h1024v1024z',
    // 饼图图例图标
    pie: 'circle',
    // 雷达图图例图标
    radar: 'path://M1024 1024H0V0h1024v1024z'
  }
  // 轴线
  public axis = {
    // x轴配置
    xAxis: {
      axisLine: { lineStyle: { color: '#dedede' } },
      axisLabel: { color: '#545454' },
      axisTick: { color: '#545454', alignWithLabel: true },
      splitLine: { show: false },
      nameTextStyle: {
        color: '#545454'
      }
    },
    // y轴配置
    yAxis: {
      axisLine: { show: false, lineStyle: { color: '#dedede' } },
      axisLabel: { color: '#545454' },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#efefef', type: 'dashed' } },
      nameTextStyle: {
        color: '#545454'
      }
    },
  }
  // 提示框
  public tooltip = {
    // 轴线配置
    axis: {
      backgroundColor: '#fff',
      axisPointer: {
        lineStyle: {
          color: '#dedede'
        }
      },
      textStyle: {
        color: '#545454'
      },
      extraCssText: 'box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);',
    },
    // 数据项配置
    item: {
      backgroundColor: '#fff',
      axisPointer: {
        lineStyle: {
          color: '#dedede'
        }
      },
      textStyle: {
        color: '#545454'
      },
      extraCssText: 'box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);',
    },
  }
  // 系列
  public serise = {
    // 图标配置
    symbol: {
      // 空心矩形图标
      emptyRect: 'path://M192 192v640h640V192z m64 64h512v512H256z',
      // 空心圆形图标
      // tslint:disable-next-line
      emptyCircle: 'path://M512 949.138286c238.72 0 437.138286-197.997714 437.138286-437.138286 0-238.72-198.857143-437.138286-437.577143-437.138286C272.438857 74.861714 74.88 273.28 74.88 512c0 239.140571 197.997714 437.138286 437.138286 437.138286z m0-72.850286C309.705143 876.288 148.114286 714.276571 148.114286 512c0-201.874286 161.152-364.288 363.446857-364.288 201.856 0 364.269714 162.432 364.708571 364.288 0.420571 202.294857-162.432 364.288-364.288 364.288z',
      // 空心三角形图标
      // tslint:disable-next-line
      emptyTriangle: 'path://M182.217143 918.070857h659.565714c72.868571 0 118.290286-52.297143 118.290286-118.290286 0-19.712-5.138286-39.862857-15.853714-58.276571L613.796571 165.924571c-22.308571-39.003429-61.293714-59.995429-101.577142-59.995428-39.862857 0-79.286857 20.992-102.016 59.995428l-330.422858 576a114.340571 114.340571 0 0 0-15.853714 57.856c0 66.011429 45.860571 118.290286 118.290286 118.290286z m0.859428-67.291428c-30.006857 0-49.737143-24.429714-49.737142-50.998858 0-7.716571 1.298286-16.713143 5.595428-25.709714l329.984-575.579428c9.435429-16.274286 26.587429-23.990857 43.300572-23.990858 16.713143 0 32.987429 7.277714 42.422857 23.990858l330.002285 576c4.278857 8.594286 6.418286 17.572571 6.418286 25.289142 0 26.569143-20.571429 51.017143-50.139428 51.017143z',
      // 空心三角形图标
      // tslint:disable-next-line
      shadow: 'path://M21.459681 9.330296v1005.339408h998.341686V9.330296H21.459681z m32.656037 441.323007l528.09476 528.094761H320.495672l-266.379954-266.379955V450.653303z m0-46.184966V68.111162l910.636902 910.636902h-336.357176L54.115718 404.468337z m23.792255-359.216401h331.692027l577.54533 577.545331v331.692027L77.907973 45.251936z m377.876993 0h261.714806l269.645558 269.645558v261.714807L455.784966 45.251936z m531.360364 223.927107l-223.460592-223.927107h223.460592v223.927107z m-933.029612 489.374032l220.194988 220.194989H54.115718v-220.194989z',
    },
    // 折线图配置
    line: {
      symbol: 'circle',
      symbolSize: 10,
    },
    // 柱状图配置
    bar: {
      barMaxWidth: 15,
    },
    // 饼图配置
    pie: {
    },
    // 雷达图配置
    radar: {
      symbol: 'none',
      areaStyle: {},
    },
    // 环形饼图配置
    ring: {
      radius: ['36%', '56%'],
    }
  }
  // 雷达图
  public radar = {
    center: ['50%', '44%'],
    radius: '50%',
    name: { color: '#A7D3FF' },
    axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
    splitArea: { show: false },
    splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
  }
  // 标签
  public label = {
  }

  /**
   * 获取图例
   * @param direction 图例方向
   * @param data 图例数据
   */
  getLegend(direction = 'top', data?: any[]) {
    return {
      ...this.legend.common,
      ...this.legend[direction],
      ...(this.isArray(data) ? {
        data: data.map(d => {
          return this.isString(d) ? d : {
            name: d.name,
            ...(d.textStyle ? { textStyle: d.textStyle } : {}),
            ...(this.legend[d.type] ? { icon: this.legend[d.type] } : {}),
            ...(d.symbol ? { icon: d.symbol } : {})
          }
        })
      } : {})
    }
  }

  /**
   * @param data 轴线数据类型
   */
  getAxisType(data: any[]) {
    if (this.isArray(data) && data.length) {
      const isValueList = data.every(d => this.isNumber(this.isObject(d) ? d.value : d))
      return isValueList ? 'value' : 'category'
    }
    return 'category'
  }
  /**
   * 获取轴线
   * @param axisType 轴线类型
   * @param data 轴线数据
   */
  getAxis(axisType = 'xAxis', data: any = {}) {
    let type = data.type || this.getAxisType(data.data)
    if (this.isArray(data)) {
      return data.map(d => {
        type = d.type || this.getAxisType(d.data)
        if (type === 'value') {
          delete d.data
        }
        return {
          type,
          ...this.axis[axisType],
          ...d
        }
      })
    }
    if (type === 'value') {
      delete data.data
    }
    return {
      type,
      ...this.axis[axisType],
      ...data
    }
  }

  /**
   * 获取提示框样式
   * @param triggerType 触发类型
   * @param tooltip 提示框配置
   */
  getTooltip(triggerType = 'axis', tooltip?: any) {
    return {
      trigger: triggerType,
      ...this.tooltip[triggerType],
      formatter: (params: any) => {
        if (this.isArray(params)) {
          return params.reduce((t, c, cIndex) => {
            const isNoSeriesName = c.seriesName.startsWith('series')
            if (!cIndex) {
              t += (isNoSeriesName ? '' : c.axisValue)
            }
            if (c.color && c.color.image) {
              c.marker = c.marker.replace(`background-color:[object Object];`, `background: url(${c.color.image.src})`)
            }
            const br = isNoSeriesName ? '' : '<br>'
            const seriesName = isNoSeriesName ? c.name : c.seriesName
            const value = this.isArray(c.value) ? c.value[1] : (this.isObject(c.value) ? c.value.value : c.value)
            t += `${br}${c.marker}${seriesName}: ${value || (value === 0 ? 0 : '-')}`
            if (c.data && c.data.unit) {
              t += typeof tooltip.unitFormat === 'function' ? tooltip.unitFormat(c.data.unit) : c.data.unit
            }
            if (tooltip && tooltip.extra) {
              t += tooltip.extra
            }
            return t
          }, '')
        } else {
          let result = `${params.marker}${params.name}: ${params.value}`
          if (tooltip && tooltip.extra) {
            result += tooltip.extra
          }
          if (params.seriesType === 'pie') {
            result += `(${params.percent}%)`
          }
          return result
        }
      }
    }
  }

  /**
   * 获取字符串宽度和高度
   * @param fontSize 字体大小
   * @param text 字符串
   */
  getTextWidthAndHeight(fontSize, text) {
    const result = { width: 0, height: 0 }
    const span = document.createElement('span')
    span.innerHTML = text
    span.style.visibility = 'hidden'
    span.style.fontSize = fontSize + 'px'
    document.body.appendChild(span)
    result.width = span.offsetWidth
    result.height = span.offsetHeight
    span.parentNode.removeChild(span)
    return result
  }
  /**
   * 获取轴线标签最大占用空间
   * @param data 轴线数据
   * @param fontSize 字体大小
   */
  getAxisLabelSpace(data: any[], fontSize = 12) {
    if (this.isArray(data)) {
      const type = this.getAxisType(data)
      return Math.max(...data.map(d => {
        let val = this.isObject(d) ? d.value : d
        if (type === 'value') {
          val = (Number(val) && Number(val).toLocaleString()) || ''
        }
        return this.getTextWidthAndHeight(fontSize, val).width
      }))
    }
    return 0
  }
  /**
   * 根据轴线数据获取格线数据
   * @param gridData 轴线数据
   * @param grid 格线数据
   */
  getGrid(gridData: any[], grid: any) {
    let result: any = {}
    if (this.isArray(gridData)) {
      result = gridData.reduce((t, c) => {
        const { data, labelWithLineSpace, index, position, fontSize } = c
        if (!t[index]) {
          t[index] = {}
        }
        if (!t[index][position]) {
          t[index][position] = 0
        }
        t[index][position] += labelWithLineSpace
        t[index][position] += this.getAxisLabelSpace(data, fontSize)
        t[index][position] += 30
        if (this.isObject(grid)) {
          if (this.isArray(grid)) {
            t[index] = {
              ...t[index],
              ...(grid[index] || {})
            }
          } else {
            t[index] = {
              ...t[index],
              ...grid
            }
          }
        }
        return t
      }, [])
    }
    if (result.length === 1) {
      if (!this.isNumber(result[0].top)) {
        result[0].top = 30
      }
      if (!this.isNumber(result[0].right)) {
        result[0].right = 30
      }
    }
    return result
  }

  /**
   * 根据颜色数组获取渐变色
   * @param colors 颜色数组
   */
  getGradient(colors: any[] = [], config: any = {}) {
    const {
      type = 'linear',
      x = 0,
      y = 0,
      x2 = 0,
      y2 = 1,
      global = false,
      ...other
    } = config || {}
    return {
      type,
      x,
      y,
      x2,
      y2,
      colorStops: colors.map((color: string, cIndex) => {
        return {
          offset: cIndex > 0 ? ((cIndex + 1) / colors.length) : 0,
          color,
        }
      }),
      global,
      ...other
    }
  }

  /**
   * 判断是否是字符串
   * @param data 数据
   */
  isString(data: any): boolean {
    return typeof data === 'string'
  }

  /**
   * 判断是否是非null的对象
   * @param data 数据
   */
  isObject(data: any): boolean {
    return typeof data === 'object' && !!data
  }

  /**
   * 判断是否是数组
   * @param data 数据
   */
  isArray(data: any): boolean {
    return data instanceof Array
  }

  /**
   * 判断是否是数字
   * @param data 数据
   */
  isNumber(data: any): boolean {
    return !!Number(data) || Number(data) === 0 || data === 0
  }

  /**
   * 判断是否是对象数组
   * @param data 数据
   */
  isObjectArray(data: any): boolean {
    return this.isArray(data) && data.every(d => this.isObject(d))
  }

  /**
   * 格式化成对象数组
   * @param data 数据
   */
  formatObjectArray(data: any) {
    if (this.isObject(data)) {
      if (this.isObjectArray(data)) {
        return data
      }
      if (this.isArray(data)) {
        return [{ data }]
      }
      return [data]
    }
    return [{}]
  }

  /**
   * 获取轴线图表配置
   * @param options 图表配置
   */
  getAxisOptions(options: any = {}) {
    const { grid = {}, tooltip = {}, legend = {}, key, val, xAxis, yAxis, series, ...others } = options

    // 图例数据处理
    const legendDirection = (legend && legend.direction) || 'bottom'
    const legendData = []

    // x轴数据处理
    const xAxisData = this.formatObjectArray(xAxis || key)

    // y轴数据处理
    const yAxisData = this.formatObjectArray(yAxis)

    // 格线数据处理
    const gridData = []

    // 系列数据处理
    const seriesData = this.formatObjectArray(series || val).map(s => {
      const xAxisIndex = s.xAxisIndex || s.xIndex || 0
      const yAxisIndex = s.yAxisIndex || s.yIndex || 0
      const data = s.data || s.val || []
      const name = s.name || s.key
      const symbol = this.serise.symbol[s.symbol] || s.symbol
      const unit = yAxisData[yAxisIndex] && yAxisData[yAxisIndex].name
      // 数组数据处理
      let isDoubleValue = false
      if (this.isArray(data)) {
        isDoubleValue = data.every(d => this.isObject(d) && (this.isArray(d) || this.isArray(d.value)))
      }
      // x轴数据处理
      if (!xAxisData[xAxisIndex]) {
        xAxisData[xAxisIndex] = {}
      }
      if (!xAxisData[xAxisIndex].data) {
        xAxisData[xAxisIndex].data = isDoubleValue ? data.map(d => d.value ? d.value[0] : d[0]) : []
      }
      // y轴数据处理
      if (!yAxisData[yAxisIndex]) {
        yAxisData[yAxisIndex] = {}
      }
      if (!yAxisData[yAxisIndex].data) {
        yAxisData[yAxisIndex].data = isDoubleValue ? data.map(d => d.value ? d.value[1] : d[1]) : data
      }
      // 格线数据处理
      if (!gridData[yAxisIndex]) {
        const isAxisReverse = xAxisData.every(x => x && x.type === 'value')
        gridData[yAxisIndex] = {
          index: yAxisData[yAxisIndex].gridIndex || 0,
          position: yAxisData[yAxisIndex].position || (yAxisIndex ? 'right' : 'left'),
          labelWithLineSpace: yAxisData[yAxisIndex].margin || 8,
          fontSize: yAxisData[yAxisIndex].fontSize || 12,
          data: isAxisReverse ? yAxisData[yAxisIndex].data
            : (isDoubleValue ? data.map(d => d.value ? d.value[1] : d[1]) : data)
        }
      }
      // 图例数据处理
      if (name) {
        legendData.push({
          name,
          type: s.legendIcon || s.type,
          symbol
        })
      }
      delete s.key
      delete s.val
      delete s.xIndex
      delete s.yIndex
      delete s.legendIcon
      return {
        ...(this.serise[s.type] || {}),
        ...s,
        ...(name ? { name } : {}),
        ...(symbol ? { symbol } : {}),
        xAxisIndex,
        yAxisIndex,
        name,
        data: data.map(d => ({
          ...((d && d.value) ? { ...d } : { value: d }),
          ...(unit ? { unit } : {})
        }))
      }
    })

    return {
      grid: this.getGrid(gridData, grid),
      tooltip: {
        ...this.getTooltip('axis', tooltip),
        ...tooltip
      },
      legend: {
        ...this.getLegend(legendDirection, legendData),
        ...legend
      },
      xAxis: this.getAxis('xAxis', xAxisData),
      yAxis: this.getAxis('yAxis', yAxisData),
      series: seriesData,
      ...others
    }
  }

  /**
   * 获取数据项图表配置
   * @param options 图表配置
   */
  getItemOptions(options: any = {}) {
    const { tooltip = {}, legend = {}, val, series, ...others } = options

    // 图例数据处理
    const legendDirection = (legend && legend.direction) || 'bottom'
    const legendData = []

    // 系列数据处理
    const seriesData = this.formatObjectArray(series || val).map(s => {
      const data = s.data || s.val || []
      const name = s.name || s.key
      // 图例数据处理
      if (name) {
        legendData.push({
          name: s.name,
          type: s.legendIcon || s.type
        })
      } else {
        if (data.every(d => this.isObject(d) && d.name)) {
          legendData.push(...data.map(d => ({
            name: d.name,
            type: d.legendIcon || s.type,
            symbol: d.symbol
          })))
        }
      }
      delete s.key
      delete s.yIndex
      delete s.yIndex
      delete s.legendIcon
      return {
        ...(this.serise[s.type] || {}),
        ...(this.serise[s.seriesType] || {}),
        ...s,
        name,
        data
      }
    })

    return {
      tooltip: {
        ...this.getTooltip('item', tooltip),
        ...tooltip
      },
      legend: {
        ...this.getLegend(legendDirection, legendData),
        ...legend
      },
      series: seriesData,
      ...others
    }
  }

  /**
   * 获取迷你轴线图表配置
   * @param data 图表配置
   */
  getSmallChart(data: any = {}) {
    const {
      grid = {},
      legend = {},
      tooltip = {},
      xAxis,
      yAxis,
      series,
      val,
      ...others
    } = data

    return this.getAxisOptions({
      legend: {
        show: false,
        ...legend
      },
      grid: {
        top: 1,
        bottom: 0,
        right: 0,
        left: 0,
        ...grid
      },
      tooltip: {
        show: false,
        ...tooltip
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        show: false,
        ...(xAxis || {}),
      },
      yAxis: {
        show: false,
        ...(yAxis || {}),
      },
      series: this.formatObjectArray(series || val).map((m: any) => {
        if (m.type === 'line') {
          return {
            ...m,
            symbol: 'none'
          }
        }
        return m
      }),
      ...others
    })
  }

  /**
   * 获取区域曲线图表配置
   * @param data 图表配置
   */
  getAreaLineChart(data: any = {}) {
    const {
      grid = {},
      legend = {},
      tooltip = {},
      xAxis,
      yAxis,
      series,
      val,
      unit,
      ...others
    } = data


    const axisLine = {
      show: true,
      lineStyle: {
        color: '#3A3D4E',
        type: 'dotted',
        opacity: 0.4
      },
    }
    const splitLine = {
      ...axisLine,
      interval: 0,
    }
    return this.getAxisOptions({
      legend: {
        show: false,
        ...legend
      },
      grid: {
        left: 0,
        bottom: 0,
        containLabel: true,
        ...grid
      },
      tooltip: {
        extraCssText: '',
        textStyle: {
          fontSize: 14,
          color: '#fff',
        },
        trigger: 'item',
        axisPointer: {
          type: 'none',
          snap: true,
          textStyle: {
            color: '#fff',
          },
        },
        padding: [5, 10],
        formatter: function (params: any) {
          return `${params.value}${tooltip.extra || ''}`;
        },
        position: 'top',
        ...tooltip
      },
      xAxis: {
        type: 'category',
        axisLine,
        splitLine,
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#BFC6E0',
          fontSize: 14
        },
        ...(xAxis || {}),
      },
      yAxis: {
        type: 'value',
        splitLine,
        axisLine,
        axisLabel: {
          color: 'rgba(191,198,224,1)',
          fontSize: 14
        },
        ...(yAxis || {}),
      },
      series: this.formatObjectArray(series || val).map((m: any) => {
        let { lineColor, areaColor, ...mOthers } = m || {}
        lineColor = this.isArray(lineColor) ? this.getGradient(lineColor) : m.lineColor
        areaColor = this.isArray(areaColor) ? this.getGradient(areaColor) : m.areaColor
        return {
          type: 'line',
          symbolSize: 5,
          showAllSymbol: true,
          symbol: 'circle',
          itemStyle: {
            color: lineColor,
          },
          lineStyle: {
            width: 1,
            color: lineColor,
          },
          areaStyle: {
            color: areaColor,
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 10
          },
          ...mOthers
        }
      }),
      ...others
    })
  }

  /**
   * 获取方块图例曲线图表配置
   * @param data 图表配置
   */
  getCubeLineChart(data: any = {}) {
    const {
      grid = {},
      legend = {},
      tooltip = {},
      xAxis,
      yAxis,
      series,
      val,
      linearColor,
      ...others
    } = data

    const linearColorList = linearColor || [
      ['#5EABF8', '#2447E1'],
      ['#FF93B8', '#FD2AA5'],
      ['#88F776', '#71FEC5'],
      ['#FFDD00', '#FDB52A'],
    ]

    const axisLine = {
      show: true,
      lineStyle: {
        color: '#3A3D4E',
        type: 'dotted',
        opacity: 0.4
      },
    }
    const splitLine = {
      ...axisLine,
      interval: 0,
    }
    return this.getAxisOptions({
      legend: {
        direction: 'top',
        left: 0,
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          color: '#fff',
        },
        icon: 'roundRect',
        data: this.formatObjectArray(series || val).map((m: any) => m.name),
        ...legend
      },
      grid: {
        top: 60,
        left: 0,
        bottom: 0,
        containLabel: true,
        ...grid
      },
      tooltip: {
        extraCssText: '',
        backgroundColor: 'rgba(50, 50, 50, 0.7)',
        textStyle: {
          color: '#fff',
        },
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          return params.reduce((t: string, c: any, cIndex: number) => {
            const isNoSeriesName = c.seriesName.startsWith('series')
            if (!cIndex) {
              t += (isNoSeriesName ? '' : c.axisValue)
            }
            const currentColor: any = linearColorList[c.seriesIndex % linearColorList.length]
            c.marker = c.marker.replace(
              'background-color:[object Object];',
              `background: linear-gradient(to bottom, ${currentColor[0]} 0%, ${currentColor[1]} 100%)`
            )
            const br = isNoSeriesName ? '' : '<br>'
            const seriesName = isNoSeriesName ? c.name : c.seriesName
            const value = this.isArray(c.value) ? c.value[1] : (this.isObject(c.value) ? c.value.value : c.value)
            t += `${br}${c.marker}${seriesName}: ${value || (value === 0 ? 0 : '-')}`
            if (c.data && c.data.unit) {
              t += typeof tooltip.unitFormat === 'function' ? tooltip.unitFormat(c.data.unit) : c.data.unit
            }
            if (tooltip && tooltip.extra) {
              t += tooltip.extra
            }
            return t
          }, '')
        },
        ...tooltip
      },
      xAxis: {
        type: 'category',
        axisLine,
        splitLine,
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#BFC6E0',
          fontSize: 14
        },
        ...(xAxis || {}),
      },
      yAxis: {
        type: 'value',
        splitLine,
        axisLine,
        axisLabel: {
          color: 'rgba(191,198,224,1)',
          fontSize: 14
        },
        ...(yAxis || {}),
      },
      series: this.formatObjectArray(series || val).map((m: any, mIndex: number) => {
        const color = this.getGradient(linearColorList[mIndex % linearColorList.length])
        return {
          type: 'line',
          symbolSize: 5,
          symbol: 'circle',
          itemStyle: {
            color,
          },
          lineStyle: {
            width: 1,
            color,
          },
          ...m
        }
      }),
      ...others
    })
  }

  /**
   * 获取含有预测虚线曲线图表配置
   * @param data 图表配置
   */
  getForecastLineChart(data: any = {}) {
    let {
      linearColor,
      legend = {},
      tooltip = {},
      xAxis,
      series,
      forecastStartIndex,
      val,
      ...others
    } = data || {}

    const linearColorList = linearColor || [
      ['#F7C876', '#FEBD71'],
      ['#76A8F7', '#8671FE'],
      ['#88F776', '#71FEC5'],
      ['#F78D76', '#FD71FE'],
    ]

    const xAxisData = xAxis?.data || []
    forecastStartIndex = forecastStartIndex || xAxisData.length
      - xAxisData.filter((f: string) => new Date(f)?.getTime() > Date.now()).length
      - 1

    return this.getCubeLineChart({
      legend: {
        left: 'auto',
        right: 20,
        itemWidth: 12,
        itemHeight: 12,
        icon: 'line',
        ...legend
      },
      tooltip: {
        formatter: (params: any) => {
          return params.reduce((t: string, c: any, cIndex: number) => {
            const isNoSeriesName = c.seriesName.startsWith('series')
            if (!cIndex) {
              t += (isNoSeriesName ? '' : c.axisValue)
            }
            if (c.value === '_' || (c.dataIndex === forecastStartIndex && cIndex % 2 === 0)) return t;
            const currentColor: any = c?.color?.colorStops
            if (currentColor) {
              c.marker = c.marker.replace(
                'background-color:[object Object];',
                `background: linear-gradient(to bottom, ${currentColor[0].color} 0%, ${currentColor[1].color} 100%)`
              )
            }
            const br = isNoSeriesName ? '' : '<br>'
            let seriesName = isNoSeriesName ? c.name : c.seriesName
            seriesName = c.dataIndex > forecastStartIndex ? seriesName + '(预测)' : seriesName
            const value = this.isArray(c.value) ? c.value[1] : (this.isObject(c.value) ? c.value.value : c.value)
            t += `${br}${c.marker}${seriesName}: ${value || (value === 0 ? 0 : '-')}`
            if (c.data && c.data.unit) {
              t += typeof tooltip.unitFormat === 'function' ? tooltip.unitFormat(c.data.unit) : c.data.unit
            }
            if (tooltip && tooltip.extra) {
              t += tooltip.extra
            }
            return t
          }, '')
        },
        ...tooltip
      },
      xAxis,
      series: this.formatObjectArray(series || val).reduce((total: any[], item: any, index: number) => {
        const color = this.getGradient(linearColorList[index % linearColorList.length])
        return [
          ...total,
          {
            symbolSize: 3,
            itemStyle: {
              color,
            },
            lineStyle: {
              width: 1,
              color,
            },
            ...item,
            data: item?.data.map((m: number, mIndex: number) => mIndex > forecastStartIndex ? '_' : m)
          },
          {
            symbolSize: 3,
            itemStyle: {
              color,
            },
            lineStyle: {
              type: 'dotted',
              width: 1,
              color,
            },
            ...item,
            id: item.id + 'forecast',
            data: item?.data.map((m: number, mIndex: number) => mIndex < forecastStartIndex ? '_' : m)
          },
        ]
      }, []),
      ...others
    })
  }

    /**
   * 获取渐变柱状图表配置
   * @param data 图表配置
   */
  getGradientBarChart(data: any = {}) {
    const {
      grid = {},
      legend = {},
      tooltip = {},
      xAxis,
      yAxis,
      series,
      val,
      unit,
      ...others
    } = data


    const axisLine = {
      show: true,
      lineStyle: {
        color: '#3A3D4E',
        type: 'dotted',
        opacity: 0.4
      },
    }
    const splitLine = {
      ...axisLine,
      interval: 0,
    }
    return this.getAxisOptions({
      legend: {
        show: false,
        ...legend
      },
      grid: {
        left: 0,
        bottom: 0,
        containLabel: true,
        ...grid
      },
      tooltip: {
        extraCssText: '',
        backgroundColor: 'rgba(50, 50, 50, 0.7)',
        textStyle: {
          color: '#fff',
        },
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          return params.reduce((t: string, c: any, cIndex: number) => {
            const isNoSeriesName = c.seriesName.startsWith('series')
            if (!cIndex) {
              t += (isNoSeriesName ? '' : c.axisValue)
            }
            const currentColor: any = c?.color?.colorStops
            if (currentColor) {
              c.marker = c.marker.replace(
                'background-color:[object Object];',
                `background: linear-gradient(to bottom, ${currentColor[0].color} 0%, ${currentColor[1].color} 100%)`
              )
            }
            const br = isNoSeriesName ? '' : '<br>'
            const seriesName = isNoSeriesName ? c.name : c.seriesName
            const value = this.isArray(c.value) ? c.value[1] : (this.isObject(c.value) ? c.value.value : c.value)
            t += `${br}${c.marker}${seriesName}: ${value || (value === 0 ? 0 : '-')}`
            if (c.data && c.data.unit) {
              t += typeof tooltip.unitFormat === 'function' ? tooltip.unitFormat(c.data.unit) : c.data.unit
            }
            if (tooltip && tooltip.extra) {
              t += tooltip.extra
            }
            return t
          }, '')
        },
        ...tooltip
      },
      xAxis: {
        type: 'category',
        axisLine,
        splitLine,
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#BFC6E0',
          fontSize: 14
        },
        ...(xAxis || {}),
      },
      yAxis: {
        type: 'value',
        splitLine,
        axisLine,
        axisLabel: {
          show: false,
        },
        ...(yAxis || {}),
      },
      series: this.formatObjectArray(series || val).map((m: any) => {
        let { color, ...mOthers } = m || {}
        color = this.isArray(color) ? this.getGradient(color) : m.color
        return {
          type: 'bar',
          barWidth: '15%',
          itemStyle: {
            barBorderRadius: 11,
            color,
          },
          ...mOthers
        }
      }),
      ...others
    })
  }

  /**
   * 获取百分比柱状图配置
   * @param data 图表配置
   */
  getPercentBar(data: any = {}) {
    const {
      grid = {},
      legend = {},
      tooltip = {},
      xAxis,
      yAxis,
      series,
      label,
      barMaxWidth = 6,
      barBorderRadius = 6,
      background,
      ...others
    } = data

    const total = precision(series?.data?.reduce((t: number, c: any) => {
      return t += (c.value || 0)
    }, 0) || 0)

    return this.getAxisOptions({
      grid: {
        left: 0,
        bottom: 0,
        containLabel: true,
        ...grid
      },
      tooltip: {
        extraCssText: '',
        backgroundColor: 'rgba(50, 50, 50, 0.7)',
        textStyle: {
          color: '#fff',
        },
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any[]) => {
          return params.reduce((t: string, c: any, cIndex: number) => {
            if (!cIndex) t += c.axisValue
            if (cIndex % 2 === 0) return t
            const value = series?.data[c.dataIndex].value
            const currentColor: any = c?.color?.colorStops
            if (currentColor) {
              c.marker = c.marker.replace(
                'background-color:[object Object];',
                `background: linear-gradient(to bottom, ${currentColor[0].color} 0%, ${currentColor[1].color} 100%)`
              )
            }
            t += `<br />${c.marker}${c.seriesName}: ${value|| (value === 0 ? 0 : '-')}`
            return t
          }, '')
        },
        ...tooltip
      },
      legend: {
        top: 0,
        right: 30,
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          color: '#FFF',
        },
        data: [{ name: series?.name, icon: 'roundRect' }],
        ...legend,
      },
      xAxis: {
        type: 'value',
        show: false,
        data: [0, 25, 50, 75, 100],
        ...(xAxis || {}),
      },
      yAxis: [
        {
          type: 'category',
          axisLine: { show: false },
          splitLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            textStyle: {
              fontFamily: 'Microsoft YaHei',
              color: '#B6BFDB',
            },
          },
          data: series?.data?.map((x: any) => x.name) || [],
          ...(yAxis || {}),
        },
        {
          type: 'category',
          axisLine: { show: false },
          splitLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          ...(yAxis || {}),
        },
      ],
      series: [
        {
          type: 'bar',
          yAxisIndex: 0,
          ...(barMaxWidth ? { barMaxWidth } : {}),
          itemStyle: {
            ...(barBorderRadius ? { barBorderRadius } : {}),
            color: this.getGradient(['rgba(44, 52, 118, 1)', 'rgba(45, 31, 87, 1)', 'rgba(20, 28, 59, 1)'])
          },
          label: {
            show: true,
            position: 'right',
            color: '#fff',
            formatter: (params: any) => {
              return `${series?.data[params.dataIndex]?.value || 0}/${total || 0}`
            }
          },
          data: series?.data?.map((x: any) => 100) || [],
          z: 0
        },
        {
          type: 'bar',
          barWidth: 20,
          yAxisIndex: 1,
          itemStyle: {
            ...(barBorderRadius ? { barBorderRadius } : {}),
            color: this.getGradient(['rgba(46, 194, 192, 1)', 'rgba(35, 151, 255, 1)'])
          },
          ...(barMaxWidth ? { barMaxWidth } : {}),
          ...series,
          data: series?.data?.map((x: any) => precision((x.value / total) * 100)) || [],
        },
      ],
      ...others
    })
  }


  /**
   * 获取环形饼图配置
   * @param data 图表配置
   */
  getRing(data: any = {}) {
    const { legend = {}, tooltip = {}, unit, val, series, ...others } = data

    return this.getItemOptions({
      legend: {
        direction: 'right',
        ...legend
      },
      tooltip: {
        extra: unit,
        ...tooltip,
      },
      series: {
        type: 'pie',
        seriesType: 'ring',
        label: {
          formatter: `{b} {c}${unit}`
        },
        data: series || val || []
      },
      ...others
    })
  }

  /**
   * 获取圆角环形饼图配置
   * @param data 图表配置
   */
  getRadiusRing(data: any = {}) {
    const {
      legend = {},
      tooltip = {},
      linearColor,
      unit,
      unitNormal = true,
      val,
      title,
      subTitle,
      series,
      seriesConfig,
      ...others
    } = data

    const linearColorList = linearColor || [
      ['#2397FF', '#2EC2C0'],
      ['#FF2778', '#FF6ACC'],
      ['#FF5F8D', '#FFE9B9'],
      ['#5848FF', '#EB84FF'],
    ]

    const legendList: string[] = []
    const objData = {}

    // 总数计算
    const totalVal = precision(this.formatObjectArray(series || val)
      .reduce((t: number, item: any) => {
        legendList.push(item.name)
        objData[item.name] = item.value
        return t + (item.value || 0)
      }, 0))

    // 圆角效果渲染
    const seriesData = this.formatObjectArray(series || val)
      .reduce((total: any[], item: any, index: number) => {
        const linearColor = this.getGradient(linearColorList[index % linearColorList.length])

        return [
          ...total,
          {
            itemStyle: {
              borderWidth: 6,
              label: {
                show: false
              },
              labelLine: {
                show: false
              },
              borderColor: linearColor,
              color: linearColor,
            },
            ...item,
            value: item.value || 0
          },
          {
            value: (totalVal && totalVal !== 100) ? (totalVal / 30) : null,
            name: '',
            tooltip: {
              show: false
            },
            itemStyle: {
              label: {
                show: false
              },
              labelLine: {
                show: false
              },
              color: 'rgba(0, 0, 0, 0)',
              borderColor: 'rgba(0, 0, 0, 0)',
              borderWidth: 0
            },
            // 标题设置
            ...((!index && subTitle) ? {
              label: {
                show: true,
                position: 'center',
                formatter: `{title|${title || 0}}\n{subtitle|${subTitle}}`,
                rich: {
                  title: {
                    fontWeight: 'bold',
                    fontSize: 20,
                    color: 'rgba(255,255,255,1)',
                    width: 144,
                    lineHeight: 36,
                    align: 'center',
                  },
                  subtitle: {
                    fontWeight: 'normal',
                    fontSize: 15,
                    color: '#CFD3EA',
                    width: 144,
                    align: 'center',
                  },
                }
              }
            } : {})
          }
        ]
      }, [])
    
    // 图例最大宽度
    const legendNameMaxWidth = Math.max(...legendList.map((m: string) => {
      return this.getTextWidthAndHeight(14, m).width
    })) || 40

    return this.getItemOptions({
      tooltip: {
        extra: unit,
        formatter: (params: any) => {
          const currentColor: any = linearColorList[(params.dataIndex / 2) % linearColorList.length]
          params.marker = params.marker.replace(
            'background-color:[object Object];',
            `background: linear-gradient(to bottom, ${currentColor[0]} 0%, ${currentColor[1]} 100%)`
          )
          const percent = `(${params.percent}%)`
          return `${params.marker}${params.name}: ${params.value || 0}${unit || ''}${unit !== '%' ? percent : ''}`
        },
        extraCssText: '',
        backgroundColor: 'rgba(50, 50, 50, 0.7)',
        textStyle: {
          color: '#fff'
        },
        ...tooltip,
      },
      legend: {
        show: false,
        type: 'scroll',
        orient: 'vertical',
        top: 'middle',
        right: '8%',
        itemGap: 15,
        itemWidth: 10,
        itemHeight: 10,
        selectedMode: false,
        icon: 'circle',
        data: legendList,
        textStyle: {
          color: 'rgba(226,226,255,1)',
          rich: {
            uname: {
              width: legendNameMaxWidth,
              fontSize: 14,
              padding: [0, 20, 0, 0]
            },
            unum: {
              fontSize: 14,
              color: 'rgba(226,226,255,1)'
            },
            unit: {
              fontSize: 14,
              color: 'rgba(226,226,255,1)'
            },
            unumBig: {
              fontSize: 26,
              fontWeight: 'normal',
              color: 'rgba(226,226,255,1)',
              padding: [0, 5, 0, 0]
            },
          },
        },
        formatter(name: string) {
          return `{uname|${name}}{${(unit && !unitNormal) ? 'unumBig' : 'unum'}|${objData[name] || 0}}{unit|${unit || ''}}`;
        },
        ...legend
      },
      series: {
        type: 'pie',
        radius: ['70%', '75%'],
        hoverAnimation: false,
        clockwise: false,
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        data: seriesData,
        ...(seriesConfig || {})
      },
      ...others
    })
  }

  /**
   * 获取百分比饼图
   * @param data 图表数据
   */
  getPercentPie(data: any = {}) {
    let {
      legend = {},
      tooltip = {},
      series = {},
      name,
      value,
      label = {},
      borderWidth = 4,
      gradient = ['#7CBFFE', '#5994FE', '#7CBFFE'],
      background = this.getGradient(['#2C3476', '#2D1F57', '#141C3B']),
      ...others
    } = data || {}

    value = Number(value || 0)
    value = value >= 100 ? 100 : value
    return this.getItemOptions({
      legend: {
        show: false,
        ...legend
      },
      tooltip: {
        formatter: () => {
          return ''
        },
        ...tooltip
      },
      series: [
        {
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['67%', '70%'],
          hoverAnimation: false,
          silent: true,
          labelLine: {
            show: false
          },
          data: [
            {
              name: ' ',
              value: 100 - (value || 0),
              label: {
                show: false
              },
              itemStyle: {
                borderColor: background,
                color: background,
                borderWidth
              },
              zlevel: -1
            },
            {
              name: name || ((value || 0) + '%'),
              value: value || null,
              label: {
                show: true,
                textStyle: {
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 'bold',
                },
                position: 'center',
                ...label
              },
              itemStyle: {
                color: this.getGradient(gradient),
                borderColor: this.getGradient(gradient),
                borderWidth
              },
              zlevel: 2
            }
          ],
          ...series
        },
      ],
      ...others
    })
  }

  /**
   * 获取百分比小饼图
   * @param data 图表数据
   */
  getPercenSmalltPie(data: any = {}) {

    return this.getPercentPie({
      borderWidth: 1,
      background: 'rgba(40,46,99,1)',
      series: {
        radius: ['63%', '68%'],
        clockWise: false,
      },
      label: {
        rich: {
          a: {
            height: 20,
            lineHeight: 20,
            align: 'center',
            fontSize: 12,
            fontWeight: 'bold',
            fontFamily: '方正粗倩_GBK',
            color: 'rgba(255,255,255,1)',
          },
          b: {
            color: 'rgba(255,255,255,1)',
            align: 'center',
            fontSize: 16,
          },
          c: {
            color: 'rgba(255,255,255,1)',
            fontSize: 16,
            fontFamily: '方正粗倩_GBK',
            fontWeight: 'bold',
          },
        },
        formatter: function (params: any) {
          return '{a|' + params.name + '}' + '\n{b|' + (params.value || 0) + '}' + '{c|%}';
        },
      },
      ...data
    })
  }

  /**
   * 获取横向柱状图配置
   * @param data 图表配置
   */
  getHorizontalBar(data: any = {}) {
    const {
      grid = {},
      legend = {},
      tooltip = {},
      key,
      val,
      xAxis,
      yAxis,
      series,
      unit,
      stack,
      barMaxWidth,
      barBorderRadius,
      ...others
    } = data

    return this.getAxisOptions({
      legend: {
        top: 40,
        direction: 'right',
        ...legend
      },
      grid: {
        top: 20,
        bottom: 40,
        right: 80,
        ...grid
      },
      tooltip: {
        extra: unit,
        ...tooltip
      },
      xAxis: {
        type: 'value',
        ...(xAxis || {}),
      },
      yAxis: {
        data: key || [],
        ...(yAxis || {}),
      },
      series: this.formatObjectArray(series || val).map(x => ({
        ...x,
        type: 'bar',
        ...(stack ? { stack } : {}),
        ...(barMaxWidth ? { barMaxWidth } : {}),
        ...(barBorderRadius ? { itemStyle: { barBorderRadius } } : {}),
      })),
      ...others
    })
  }
}

export const EchartsService = new ChartService()
