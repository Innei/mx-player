/*
 * @Author: Innei
 * @Date: 2020-07-22 20:04:41
 * @LastEditTime: 2020-07-30 12:43:30
 * @LastEditors: Innei
 * @FilePath: /mx-player/src/typings.d.ts
 * @Coding with Love
 */

/**
 * Default CSS definition for typescript,
 * will be overridden with file-specific definitions by rollup
 */
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}
declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}

interface SvgrComponent
  extends React.StatelessComponent<React.SVGAttributes<SVGElement>> {}

declare module '*.svg' {
  const svgUrl: string
  const svgComponent: SvgrComponent
  export default svgUrl
  export { svgComponent as ReactComponent }
}
