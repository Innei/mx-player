/*
 * @Author: Innei
 * @Date: 2020-07-22 22:05:16
 * @LastEditTime: 2020-07-22 22:11:46
 * @LastEditors: Innei
 * @FilePath: /mx-player/src/utils/index.ts
 * @Coding with Love
 */
export const classNames = (
  ...className: (string | boolean | null | undefined)[]
): string => {
  return className
    .map((_class) => {
      if (!_class) {
        return ''
      } else {
        return _class
      }
    })
    .join(' ')
}

export const second2Hours = (second: number) => {
  const minutes = Math.floor(second / 60)
  const seconds = second - minutes * 60
  const hours = Math.floor(second / 3600)
  return `${hours > 0 ? hours.toFixed().padStart(2, '0') + ':' : ''}${
    minutes > 0 ? minutes.toFixed().padStart(2, '0') + ':' : ''
  }${seconds.toFixed().padStart(2, '0')}`
}

export function fancyTimeFormat(duration: number) {
  // Hours, minutes and seconds
  var hrs = ~~(duration / 3600)
  var mins = ~~((duration % 3600) / 60)
  var secs = ~~duration % 60

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = ''

  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '')
  }

  ret += '' + mins + ':' + (secs < 10 ? '0' : '')
  ret += '' + secs
  return ret
}
