import { Player, Controls } from 'mx-player'
import React, { Fragment, useEffect, useRef, useState } from 'react'

import 'mx-player/dist/index.css'
const App = () => {
  const ref = useRef<HTMLVideoElement>(null)
  const localVideo = require('./1080_7.mp4')
  const online = 'https://tu-1252943311.cos.ap-shanghai.myqcloud.com/1080_7.mp4'
  // useEffect(() => {
  //   console.log(ref, ref.current)
  //   if (!ref.current) {
  //     return
  //   }
  //   const height = ref.current.videoHeight
  //   const width = ref.current.videoWidth
  //   console.log(height, width)

  //   setHeight(height / 2)
  //   setWidth(width / 2)
  // }, [ref])
  return (
    <Fragment>
      <Player src={online} ref={ref as any} width={480} height={270} muted />
    </Fragment>
  )
}

export default App
