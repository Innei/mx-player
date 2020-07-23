import { Player, Controls } from 'mx-player'
import React, { Fragment, useEffect, useRef, useState } from 'react'

import 'mx-player/dist/index.css'
const App = () => {
  const ref = useRef<HTMLVideoElement>(null)
  const [width, setWidth] = useState(480)
  const [height, setHeight] = useState(270)
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
      <Player
        src={require('./1080_7.mp4')}
        ref={ref as any}
        height={height}
        width={width}
        muted
      />
    </Fragment>
  )
}

export default App
