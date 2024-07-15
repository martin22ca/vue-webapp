export function getType(val: any) {
    return Object.prototype.toString.call(val).slice(8, -1)
  }
  
  export function isFunction(val: any) {
    return getType(val) === 'Function'
  }