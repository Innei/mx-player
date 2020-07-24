import { Player } from 'mx-player'
import 'mx-player/dist/index.css'
import React, { Fragment, useRef } from 'react'

const App = () => {
  const ref = useRef<HTMLVideoElement>(null)
  const online =
    'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4'
  // const offline = require('./1080_7.mp4')
  return (
    <Fragment>
      <Player
        crossOrigin="anonymous"
        // src={offline}
        src={online}
        ref={ref as any}
        width={480}
        height={270}
        muted
      />
    </Fragment>
  )
}

export default App
