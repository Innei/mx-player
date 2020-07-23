import React, { Ref } from 'react'

/*
 * @Author: Innei
 * @Date: 2020-07-22 20:35:16
 * @LastEditTime: 2020-07-22 20:35:17
 * @LastEditors: Innei
 * @FilePath: /mx-player/src/hooks/use-combine-ref.ts
 * @Coding with Love
 */
export function useCombinedRefs<T = any>(...refs: Ref<T>[]) {
  const targetRef = React.useRef<T>()

  React.useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return

      if (typeof ref === 'function') {
        ref(targetRef.current as T | null)
      } else {
        // @ts-ignore
        ref.current = targetRef.current
      }
    })
  }, [refs])

  return targetRef
}
