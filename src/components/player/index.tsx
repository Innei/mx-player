import throttle from 'lodash/throttle'
import * as React from 'react'
import ReactDOM from 'react-dom'
import { useCombinedRefs } from '../../hooks/use-combine-ref'
import { External, Mute, UnMute } from '../../icons'
import { Pause } from '../../icons/pause'
import { Play } from '../../icons/play'
import { classNames, fancyTimeFormat } from '../../utils'
import styles from './styles.module.css'

interface PlayerProps {
  maxHeight?: number

  maxWidth?: number

  src: string
}

enum PlayState {
  Pause,
  Playing,
}

interface ExternalPlayerProps {
  src: string
  onClose: () => void
}
const ExternalPlayer: React.FC<ExternalPlayerProps> = (props) => {
  const { src, onClose } = props
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.code === 'Escape' ||
        e.keyCode === 27 ||
        e.key === 'Escape' ||
        e.which === 27
      ) {
        onClose()
      }
    }
    document.addEventListener('keydown', handler)

    return () => {
      document.removeEventListener('keydown', handler)
    }
  }, [])
  const Player: React.FC = () => {
    return (
      <div className={classNames(styles['external-container'], styles.flex)}>
        <video
          src={src}
          controls
          style={{ maxWidth: '70vw', maxHeight: '60vh' }}
        />
      </div>
    )
  }
  return ReactDOM.createPortal(<Player />, document.body)
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
  const [time, setTime] = React.useState<string>('0:00')

  const [playing, setPlaying] = React.useState(false)
  const [muted, setMute] = React.useState(false)
  const [external, setExternal] = React.useState(false)
  const vRef = React.useRef<HTMLVideoElement>(null)
  const combinedRef = useCombinedRefs(ref, vRef)

  const handlePlay = React.useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      setPlaying(true)
    },
    [],
  )
  const handlePause = React.useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      e.preventDefault()

      const targe = e.target as HTMLVideoElement
      targe.pause()
      setPlaying(false)
    },
    [],
  )
  const handleTimeUpdate = React.useCallback(
    throttle((e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      const target = e.target as HTMLVideoElement
      setTime(fancyTimeFormat(target.duration - target.currentTime))
    }, 30),
    [],
  )
  const closeExternalPlayer = React.useCallback(() => {
    setExternal(false)
  }, [])
  return (
    <div className={classNames(styles['player-wrap'], external && styles.hide)}>
      <div className={classNames(styles.time, styles.flex, styles.actions)}>
        <time style={{ paddingRight: '5px' }}>{time}</time>
        <div
          className={styles.flex}
          onClick={() => {
            setMute(!muted)
          }}
        >
          {vRef.current?.muted ? <Mute /> : <UnMute />}
        </div>
      </div>
      <div
        className={classNames(styles['right-btn'], styles.flex, styles.actions)}
        onClick={() => {
          setExternal(true)
        }}
      >
        <External />
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
          onDoubleClick={() => {
            if (!vRef.current) {
              return
            }
            vRef.current.requestFullscreen()
          }}
          onTimeUpdate={handleTimeUpdate}
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
      {external && <ExternalPlayer src={src} onClose={closeExternalPlayer} />}
    </div>
  )
})
