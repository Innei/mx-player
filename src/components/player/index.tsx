import * as React from 'react'
import { useCombinedRefs } from '../../hooks/use-combine-ref'
import styles from './styles.module.css'
import { classNames, fancyTimeFormat } from '../../utils'
import { Pause } from '../../icons/pause'
import { Play } from '../../icons/play'
import { Mute, UnMute } from '../../icons'

interface PlayerProps {
  maxHeight?: number

  maxWidth?: number

  src: string
}

enum PlayState {
  Pause,
  Playing,
}
export const Player: React.FC<
  PlayerProps &
    Partial<
      React.DetailedHTMLProps<
        React.VideoHTMLAttributes<HTMLVideoElement>,
        HTMLVideoElement
      >
    >
> = React.forwardRef((props, ref) => {
  const { maxHeight, maxWidth, src, ...rest } = props
  const [time, setTime] = React.useState<string>(null!)
  const [timer, setTimer] = React.useState<NodeJS.Timeout>(null!)
  const [playing, setPlaying] = React.useState(false)
  const [muted, setMute] = React.useState(false)
  const vRef = React.useRef<HTMLVideoElement>(null)
  const combinedRef = useCombinedRefs(ref, vRef)

  const handlePlay = React.useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      e.preventDefault()
      const target = e.target as HTMLVideoElement
      if (timer) {
        clearInterval(timer)
      }
      target.play().then(() => {
        setPlaying(true)
      })
      setTimer(
        setInterval(() => {
          // console.log(target.currentTime)

          setTime(fancyTimeFormat(target.duration - target.currentTime))
        }, 100),
      )
    },
    [],
  )
  const handlePause = React.useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      e.preventDefault()

      if (timer) {
        clearTimeout(timer)
      }
      const targe = e.target as HTMLVideoElement
      targe.pause()
      setPlaying(false)
    },
    [],
  )
  return (
    <div className={styles['player-wrap']}>
      <div className={styles.time}>
        {time}
        <div
          className="muted"
          onClick={() => {
            setMute(!muted)
          }}
        >
          {vRef.current?.muted ? <Mute /> : <UnMute />}
        </div>
      </div>
      <div
        className={classNames(
          !playing && styles['blur-overlay'],
          'inner-video',
        )}
      >
        <div
          className={classNames(
            styles['control-button'],
            playing && styles.playing,
          )}
          onClick={() => {
            if (!vRef.current) {
              return
            }
            if (playing) {
              vRef.current.pause()
            } else {
              vRef.current.play()
            }
          }}
        >
          {playing ? <Pause /> : <Play />}
        </div>
        <video
          {...rest}
          ref={combinedRef as any}
          muted={muted}
          onPlay={handlePlay}
          onPause={handlePause}
          onLoadedData={(e) => {
            // vRef.current?.play()
            // console.log(e.target)
            const { duration } = e.target as HTMLVideoElement
            const time = fancyTimeFormat(duration)
            setTime(time)
          }}
        >
          <source src={src} />
        </video>
      </div>
    </div>
  )
})
