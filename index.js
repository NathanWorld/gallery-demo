import React from 'react'
import { render } from 'react-dom'
import Gallery from './src/Gallery'

// CSS
import './styles/main.scss'

render(
  <Gallery />,
  document.getElementById('content')
)


/* 存在两个问题
 * 1、 CSS 文件怎么打包进来 - 可以如上直接导入
 * 2、 图片静态资源怎么打包进来 
 *    : 其实不用打包，重新构建自己的服务器，
 *      这些都属于静态资源，直接提供访问路径即可；
 */ 