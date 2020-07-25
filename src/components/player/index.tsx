import throttle from 'lodash/throttle'
import * as React from 'react'
import ReactDOM from 'react-dom'
import { useCombinedRefs } from '../../hooks/use-combine-ref'
import { Close, Download, External, Mute, UnMute } from '../../icons'
import { Pause } from '../../icons/pause'
import { Play } from '../../icons/play'
import {
  calculateDimensions,
  classNames,
  fancyTimeFormat,
  getKeyValueFromStore,
  requestFullscreen,
  setKeyValueStore,
} from '../../utils'
import { Controls } from '../controls'
import { Menu, MenuType } from '../menu'
import styles from './styles.module.css'

declare type VideoEvent = React.SyntheticEvent<HTMLVideoElement, Event>
interface PlayerProps {
  maxHeight?: number

  maxWidth?: number

  src: string
  height?: number
  width?: number
}

export enum PlayState {
  Pause,
  Playing,
}
type MetaData = { currentTime: number; state: PlayState; volume: number }
interface ExternalPlayerProps {
  src: string
  onClose: (meta: MetaData) => void
  metaData: MetaData

  overlayColor?: string
  className?: string
}
const ExternalPlayer: React.FC<ExternalPlayerProps> = (props) => {
  const { src, onClose, metaData, overlayColor, className } = props
  const handleExit = React.useCallback(() => {
    if (!videoRef.current) {
      return
    }
    onClose({
      currentTime: videoRef.current.currentTime,
      volume: videoRef.current.volume,
      state: videoRef.current.paused ? PlayState.Pause : PlayState.Playing,
    })
  }, [onClose])
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.code === 'Escape' ||
        e.keyCode === 27 ||
        e.key === 'Escape' ||
        e.which === 27
      ) {
        handleExit()
      }
      if (!videoRef.current) {
        return
      }
      const target = videoRef.current
      const cur = target.currentTime
      // `->`
      if (
        e.code === 'ArrowRight' ||
        e.key === 'ArrowRight' ||
        e.which === 39 ||
        e.keyCode === 39
      ) {
        if (cur + 10 > target.duration) {
          target.currentTime = target.duration
        } else {
          target.currentTime = cur + 10
        }
      }
      if (
        e.code === 'ArrowLeft' ||
        e.key === 'ArrowLeft' ||
        e.which === 37 ||
        e.keyCode === 37
      ) {
        if (cur - 10 < 0) {
          target.currentTime = 0
        } else {
          target.currentTime = cur - 10
        }
      }

      if (
        e.key === '(Space character)' ||
        e.code === 'Space' ||
        e.keyCode === 32 ||
        e.which === 32
      ) {
        target.paused ? target.play() : target.pause()
      }
    }
    document.documentElement.style.overflow = 'hidden'
    document.addEventListener('keydown', handler)

    return () => {
      document.removeEventListener('keydown', handler)
      document.documentElement.style.overflow = ''
    }
  }, [handleExit])
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
  const [volume, setVolume] = React.useState(metaData.volume || 0.5)
  const [duration, setDuration] = React.useState(0)
  const [buffered, setBuffered] = React.useState(0)
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

  const handleProgress = React.useCallback((e) => {
    try {
      const target = e.target as HTMLVideoElement
      const buffered = target.buffered.end(0)
      const duration = target.duration
      const bufferedPercentage = (buffered / duration) * 100
      setBuffered(bufferedPercentage)
    } catch (e) {
      console.log(e)
    }
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
          onProgress={handleProgress}
          onLoadedData={(e) => {
            const target = e.target as HTMLVideoElement
            const { currentTime, state, volume } = metaData
            target.currentTime = currentTime
            if (state === PlayState.Playing && target.paused) {
              target.play()
            }
            if (volume !== 0) {
              target.volume = volume
            } else {
              const volume = target.volume

              setVolume(volume)
            }
            const { duration } = target
            setDuration(duration)
          }}
        />
        <div
          className={classNames(styles.close, styles.flex)}
          onClick={handleExit}
        >
          <Close />
        </div>
      </div>
    )
  }, [
    className,
    handleExit,
    handleProgress,
    handleTimeUpdate,
    metaData,
    muted,
    overlayColor,
    src,
    volume,
  ])

  return ReactDOM.createPortal(
    <React.Fragment>
      {Player}
      <Controls
        {...{
          currentTime,
          duration,
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
          onRequestFullScreen: videoRef.current
            ? requestFullscreen.bind(videoRef.current, videoRef.current)
            : undefined,
          actions: [
            <React.Fragment key="download">
              <a download href={src} className={styles.link}>
                <Download />
              </a>
            </React.Fragment>,
          ],
          buffered,
        }}
      />
    </React.Fragment>,
    document.body,
  )
}
export const Player: React.FC<
  PlayerProps &
    Omit<
      React.DetailedHTMLProps<
        React.VideoHTMLAttributes<HTMLVideoElement>,
        HTMLVideoElement
      >,
      'height' | 'width'
    >
> = React.forwardRef((props, ref) => {
  const { height, width, maxHeight, maxWidth, src, ...rest } = props
  const previewRect = { height, width }
  if (maxHeight && maxWidth && height && width) {
    const res = calculateDimensions(width, height, {
      width: maxHeight,
      height: maxHeight,
    })
    previewRect.height = res.height
    previewRect.width = res.width
  }
  const [time, setTime] = React.useState<string>('0:00')

  const [playing, setPlaying] = React.useState(false)
  const [muted, setMute] = React.useState(rest.muted || false)
  const [external, setExternal] = React.useState(false)
  const [volume, setVolume] = React.useState<number>(
    (getKeyValueFromStore('volume') as number) || 0.5,
  )
  const [externalMetaData, setMetaData] = React.useState({
    state: PlayState.Pause,
    currentTime: 0,
    volume: 50,
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

  const handleCloseExternalPlayer = React.useCallback(
    ({ currentTime, volume, state }: MetaData) => {
      setExternal(false)
      setVolume(volume)
      setKeyValueStore('volume', volume)
      if (vRef.current) {
        vRef.current.volume = volume
        vRef.current.currentTime = currentTime
        state === PlayState.Pause ? vRef.current.pause() : vRef.current.play()
      }
    },
    [],
  )

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
      volume,
    })
    vRef.current.pause()
    setPlaying(false)
    setExternal(true)
  }, [playing, volume])

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

  const [MenuPosition, setMenuPosition] = React.useState<{
    x: number
    y: number
  }>(null!)
  const MenuItem = React.useMemo<MenuType[]>(() => {
    return [
      {
        name: '关于作者',
        onClink: () => {
          window.open('https://innei.ren/about')
        },
      },
      {
        name: 'mx-player',
        onClink: () => {
          window.open('https://github.com/innei/mx-player')
        },
      },
    ]
  }, [])
  React.useEffect(() => {
    const handler = () => {
      setMenuPosition(null!)
    }
    window.addEventListener('click', handler)
    return () => {
      window.removeEventListener('click', handler)
    }
  }, [])
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
          className={styles.overlay}
          onClick={handlePlayPause}
          onContextMenu={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setMenuPosition({ x: e.clientX, y: e.clientY })
          }}
        >
          <div
            className={classNames(
              styles['control-button'],
              playing && styles.playing,
            )}
          >
            {playing ? <Pause /> : <Play />}
          </div>
        </div>
        <video
          {...rest}
          ref={combinedRef as any}
          muted={muted}
          height={previewRect.height}
          width={previewRect.width}
          onPlay={handlePlay}
          onPause={handlePause}
          onDoubleClick={() => {
            if (!vRef.current) {
              return
            }
            requestFullscreen(vRef.current)
          }}
          onTimeUpdate={handleTimeUpdate}
          onLoadedData={(e) => {
            const target = e.target as HTMLVideoElement
            const duration = target.duration
            const time = fancyTimeFormat(duration)
            target.volume = volume
            setTime(time)
          }}
        >
          <source src={src} />
        </video>
      </div>
      {MenuPosition && <Menu items={MenuItem} position={MenuPosition} />}
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
