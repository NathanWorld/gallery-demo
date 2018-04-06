import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import ImgFigure from './ImgFigure'
import ControllerUnit from './ControllerUnit'

//import { getRangeRandom, get30DegRandom } from '../utils/Common'
import * as utils from '../utils/Common'

const getRangeRandom = utils.getRangeRandom
const get30DegRandom = utils.get30DegRandom

// CSS
//import '../styles/main.scss'
//require('./styles/main.scss')

// 获取图片相关数据
let imageDatas = require('../data/imageDatas.json')

// genImageURL 的箭头函数，且利用自执行方式
// 将图片名称信息转成图片URL路径信息
// TODO: 图片资源如何打包? 还不太会配置
imageDatas = ((imageDataArr) => {
  for (let i = 0, j = imageDataArr.length; i < j; i++) {
    let singleImageData = imageDataArr[i]
    singleImageData.imageURL = '../images/' + singleImageData.fileName
    imageDataArr[i] = singleImageData
  }
  return imageDataArr
})(imageDatas)
//imageDatas = genImageURL(imageDatas)

const Constant = {
  centerPos: {
    left: 0,
    right: 0
  },
  hPosRange: { // 水平方向的取值范围
    leftSecX: [0, 0],
    rightSecX: [0, 0],
    y: [0, 0]
  },
  vPosRange: { // 垂直方向的取值范围
    x: [0, 0],
    topY: [0, 0]
  }
}

// 背景框架
class Gallery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Constant: Constant,
      imgsArrangeArr: [
        /*{
          pos: {
            left: '0',
            top: '0'
          },
          rotate: '0', // 旋转角度
          isInverse: false, //图片正反面
          isCenter: false,  //图片是否居中
        }*/
      ]
    }
    this.inverse = this.inverse.bind(this)
  }  

  /*
   * 翻转图片
   * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
   * @return {Function} 这是一个闭包函数，其内return一个真正待被执行的函数
   */
  /*
  inverse(index) {
    return () => {
      let imgsArrangeArr = this.state.imgsArrangeArr
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      })
    }
  }
  */
  inverse(index) {
    let imgsArrangeArr = this.state.imgsArrangeArr
    imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    })
  }

  /*
   * 重新布局所有图片
   * @param centerIndex 指定居中排布哪个图片
   */
  rearrange(centerIndex) {
    const imgsArrangeArr = this.state.imgsArrangeArr
    const Constant = this.state.Constant
    const centerPos = Constant.centerPos
    const hPosRange = Constant.hPosRange
    const vPosRange = Constant.vPosRange
    const hPosRangeLeftSecX = hPosRange.leftSecX
    const hPosRangeRightSecX = hPosRange.rightSecX
    const hPosRangeY = hPosRange.y
    const vPosRangeTopY = vPosRange.topY
    const vPosRangeX = vPosRange.x

    let imgsArrangeTopArr = []
    let topImgNum = Math.floor(Math.random() * 2) // 取一个或不取 放到上侧区
    let topImgSpliceIndex = 0
    const imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1)

    // 居中，centerIndex 的图片, 居中的，centerIndex 的图片不需要旋转
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    }

    // 取出布局上侧的图片的状态信息
    topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum))
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum)

    // 布局位于上侧的图片
    imgsArrangeTopArr.forEach((value, index) => {
      imgsArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      }
      //console.log(index + ': ' + imgsArrangeTopArr[index].rotate)
    })

    // 布局左右两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null

      // 前半部分布局左边， 右半部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX
      } else {
        hPosRangeLORX = hPosRangeRightSecX
      }

      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      }
    }

    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0])
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0])

    this.setState({
      imgsArrangeArr: imgsArrangeArr
    })
  }

  /*
   * 利用 rearrange 函数，居中对应 index 的图片
   * @param index, 需要被居中的图片对应的图片信息数组的index值
   * @return {Function}
   */
  center(index) {
    return(() => {
      this.rearrange(index)
    })

  }


  //组件加载后，为每张图片计算其位置的范围
  componentDidMount() {
    // 拿到舞台的大小
    const stagedom = ReactDOM.findDOMNode(this.refs.stage)
    const stageW = stagedom.scrollWidth
    const stageH = stagedom.scrollHeight
    const halfStageW = Math.floor(stageW / 2)
    const halfStageH = Math.floor(stageH / 2)
    // 拿到一个imageFigure的大小
    const imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0)
    const imgW = imgFigureDOM.scrollWidth
    const imgH = imgFigureDOM.scrollHeight
    const halfImgW = Math.floor(imgW / 2)
    const halfImgH = Math.floor(imgH / 2)

    // 计算中心图片的位置点
    this.state.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    // 计算左侧、右侧区域图片排布位置的取值范围
    this.state.Constant.hPosRange.leftSecX[0] = -halfImgW
    this.state.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3
    this.state.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW
    this.state.Constant.hPosRange.rightSecX[1] = stageW - halfImgW
    this.state.Constant.hPosRange.y[0] = -halfImgH
    this.state.Constant.hPosRange.y[1] = stageH - halfImgH

    // 计算上侧区域图片排布位置的取值范围
    this.state.Constant.vPosRange.topY[0] = -halfImgH
    this.state.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3
    this.state.Constant.vPosRange.x[0] = halfStageW - imgW
    this.state.Constant.vPosRange.x[1] = halfStageW

    this.rearrange(0)
  }

  render() {
    const controllerUnits = []
    const imgFigures = []
    imageDatas.forEach((value, index) => {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }
      imgFigures.push(
        <ImgFigure 
          key={'imgFigure' + index} 
          data={value} 
          ref={'imgFigure' + index} 
          arrange={this.state.imgsArrangeArr[index]} 
          inverse={() => this.inverse(index)}
          center={() => this.rearrange(index)}
        />
      )
      controllerUnits.push(
        <ControllerUnit
          key={'CU' + index}
          arrange={this.state.imgsArrangeArr[index]}
          inverse={() => this.inverse(index)}
          center={() => this.rearrange(index)}
        />
      )
    })
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    )
  }
}

export default Gallery
