
/*
 * 获取区间内的一个随机值
 */
export const getRangeRandom = (low, high) => {
  return Math.floor(Math.random() * (high - low) + low)
}

/*
 * 获取 0~30 度之间的一个任意正负值
 */ 
export const get30DegRandom = () => {
  return((Math.random() > 0.5 ? '' : '-') + Math.floor(Math.random() * 30))
}