/*
 * @Author: Innei
 * @Date: 2020-07-22 22:05:16
 * @LastEditTime: 2020-07-26 20:11:28
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

export const calculateDimensions = (
  width: number,
  height: number,
  max: { width: number; height: number },
) => {
  const { height: maxHeight, width: maxWidth } = max
  const wRatio = maxWidth / width
  const hRatio = maxHeight / height
  let ratio = 1
  if (maxWidth === Infinity && maxHeight === Infinity) {
    ratio = 1
  } else if (maxWidth === Infinity) {
    if (hRatio < 1) ratio = hRatio
  } else if (maxHeight === Infinity) {
    if (wRatio < 1) ratio = wRatio
  } else if (wRatio < 1 || hRatio < 1) {
    ratio = wRatio <= hRatio ? wRatio : hRatio
  }
  if (ratio < 1) {
    return {
      width: width * ratio,
      height: height * ratio,
    }
  }
  return {
    width,
    height,
  }
}
declare const document: any

export function requestFullscreen<T extends HTMLElement>(element: T) {
  const fullscreenEnabled =
    document.fullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.documentElement.webkitRequestFullScreen

  if (!fullscreenEnabled) {
    return
  }
  if (element.requestFullscreen) {
    element.requestFullscreen()
    // @ts-ignore
  } else if (element.mozRequestFullScreen) {
    // @ts-ignore
    element.mozRequestFullScreen()
    // @ts-ignore
  } else if (element.webkitRequestFullScreen) {
    // @ts-ignore
    element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
  }
}
export const storePrefix = 'MX_PLAYER_'
export const setKeyValueStore = (key: string, value: any) => {
  localStorage.setItem(
    storePrefix.concat(key.toUpperCase()),
    JSON.stringify(value),
  )
}

export const getKeyValueFromStore = (key: string): unknown => {
  return JSON.parse(
    localStorage.getItem(storePrefix.concat(key.toUpperCase())) || 'null',
  )
}
