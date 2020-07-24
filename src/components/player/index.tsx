import throttle from 'lodash/throttle'
import * as React from 'react'
import ReactDOM from 'react-dom'
import { useCombinedRefs } from '../../hooks/use-combine-ref'
import { Close, Download, External, Mute, UnMute } from '../../icons'
import { Pause } from '../../icons/pause'
import { Play } from '../../icons/play'
import { classNames, fancyTimeFormat } from '../../utils'
import { Controls } from '../controls'
import styles from './styles.module.css'

declare type VideoEvent = React.SyntheticEvent<HTMLVideoElement, Event>
interface PlayerProps {
  maxHeight?: number

  maxWidth?: number

  src: string
}

export enum PlayState {
  Pause,
  Playing,
}

interface ExternalPlayerProps {
  src: string
  onClose: () => void
  metaData: { currentTime: number; state: PlayState }

  overlayColor?: string
  className?: string
}
const ExternalPlayer: React.FC<ExternalPlayerProps> = (props) => {
  const { src, onClose, metaData, overlayColor, className } = props

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
  }, [onClose])
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const [currentTime, setCurrentTime] = React.useState(
    metaData.currentTime || 0,
  )
  const handleTimeUpdate = React.useCallback((e: VideoEvent) => {
    const target = e.target as HTMLVideoElement
    const current = target.currentTime
    setCurrentTime(current)
  }, [])
  const [muted, setMuted] = React.useState(false)
  const [volume, setVolume] = React.useState(50)
  const [duration, setDuration] = React.useState(0)
  const handleVolumeChange = React.useCallback((volume: number) => {
    if (!videoRef.current) {
      return
    }
    videoRef.current.volume = volume
    setVolume(volume)
  }, [])
  const handleProgressDrag = (percent: number) => {
    if (!videoRef.current) {
      return
    }
    const currentTime = percent * videoRef.current.duration
    videoRef.current.currentTime = currentTime
    setCurrentTime(currentTime)
  }
  const handlePlayPause = React.useCallback(() => {
    if (!videoRef.current) {
      return
    }
    videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause()
  }, [])
  const Player = React.useMemo(() => {
    return (
      <div
        className={classNames(
          styles['external-container'],
          styles.flex,
          className,
        )}
        style={{ backgroundColor: overlayColor }}
      >
        <video
          ref={videoRef}
          src={src}
          muted={muted}
          style={{ maxWidth: '70vw', maxHeight: '60vh' }}
          onTimeUpdate={handleTimeUpdate}
          onVolumeChange={(e) => {
            const target = e.target as HTMLVideoElement

            if (target.volume !== volume) {
              setVolume(target.volume)
            }
          }}
          onLoadedData={(e) => {
            const target = e.target as HTMLVideoElement
            const { currentTime, state } = metaData
            target.currentTime = currentTime
            if (state === PlayState.Playing && target.paused) {
              target.play()
            }
            const volume = target.volume
            setVolume(volume)
            const { duration } = target
            setDuration(duration)
          }}
        />
        <div
          className={classNames(styles.close, styles.flex)}
          onClick={onClose}
        >
          <Close />
        </div>
      </div>
    )
  }, [
    className,
    handleTimeUpdate,
    metaData,
    muted,
    onClose,
    overlayColor,
    src,
    volume,
  ])

  return ReactDOM.createPortal(
    <React.Fragment>
      {Player}
      <Controls
        {...{
          currentTime: fancyTimeFormat(currentTime),
          duration: fancyTimeFormat(duration),
          isMuted: muted,
          onMute: (state) => {
            setMuted(state)
          },
          volume,
          onVolumeChange: handleVolumeChange,
          onProgressDrag: handleProgressDrag,
          progressPercent: currentTime / duration,
          isPlay: !videoRef.current?.paused,
          onPlayPause: handlePlayPause,
          onRequestFullScreen: videoRef.current?.requestFullscreen.bind(
            videoRef.current,
          ),
          actions: [
            <React.Fragment key="download">
              <a download href={src} className={styles.link}>
                <Download />
              </a>
            </React.Fragment>,
          ],
        }}
      />
    </React.Fragment>,
    document.body,
  )
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
  const [muted, setMute] = React.useState(rest.muted || false)
  const [external, setExternal] = React.useState(false)
  const [externalMetaData, setMetaData] = React.useState({
    state: PlayState.Pause,
    currentTime: 0,
  })
  const vRef = React.useRef<HTMLVideoElement>(null)
  const combinedRef = useCombinedRefs(ref, vRef)

  const handlePlay = React.useCallback((e: VideoEvent) => {
    setPlaying(true)
  }, [])
  const handlePause = React.useCallback((e: VideoEvent) => {
    e.preventDefault()

    const target = e.target as HTMLVideoElement
    target.pause()
    setPlaying(false)
  }, [])
  const handleTimeUpdate = React.useCallback(
    throttle((e: VideoEvent) => {
      try {
        const target = e.target as HTMLVideoElement
        if (target.duration - target.currentTime >= 0) {
          setTime(fancyTimeFormat(target.duration - target.currentTime))
        }
      } catch {
        console.log('time update error')
      }
    }, 30),
    [],
  )

  const handleCloseExternalPlayer = React.useCallback(() => {
    setExternal(false)
  }, [])

  const handleMute = React.useCallback(() => {
    setMute(!muted)
  }, [muted])

  const handlePopup = React.useCallback(() => {
    if (!vRef.current) {
      return
    }

    const currentTime = vRef.current.currentTime

    setMetaData({
      currentTime,
      state: playing ? PlayState.Playing : PlayState.Pause,
    })
    vRef.current.pause()
    setPlaying(false)
    setExternal(true)
  }, [playing])

  const handlePlayPause = React.useCallback(() => {
    if (!vRef.current) {
      return
    }
    if (playing) {
      vRef.current.pause()
    } else {
      vRef.current.play()
    }
  }, [playing])

  return (
    <div className={classNames(styles['player-wrap'], external && styles.hide)}>
      <div className={classNames(styles.time, styles.flex, styles.actions)}>
        <time style={{ paddingRight: '5px' }}>{time}</time>
        <div className={styles.flex} onClick={handleMute}>
          {vRef.current?.muted ? <Mute /> : <UnMute />}
        </div>
      </div>
      <div
        className={classNames(styles['right-btn'], styles.flex, styles.actions)}
        onClick={handlePopup}
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
          onClick={handlePlayPause}
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
      {external && (
        <ExternalPlayer
          src={src}
          onClose={handleCloseExternalPlayer}
          metaData={externalMetaData}
        />
      )}
    </div>
  )
})
