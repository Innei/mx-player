/*
 * @Author: Innei
 * @Date: 2020-07-23 14:40:05
 * @LastEditTime: 2020-07-24 19:40:52
 * @LastEditors: Innei
 * @FilePath: /mx-player/src/components/controls/index.tsx
 * @Coding with Love
 */

import React, { FC, memo, useCallback, useEffect, useState } from 'react'
import { PlayState } from '../..'
import { Expand, Mute, Pause, Play, Volume } from '../../icons'
import { classNames, fancyTimeFormat } from '../../utils'
import styles from './styles.module.css'

interface ProgressProps {
  percent: number
  width?: string | number
  onChange: (currentPercent: number) => void
  style?: React.CSSProperties | undefined
}
const Progress: FC<
  ProgressProps &
    Omit<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >,
      'onChange'
    >
> = ({ percent, width, onChange, style = {}, ...rest }) => {
  const [current, setCurrent] = useState(percent * 100 || 0)
  useEffect(() => {
    setCurrent(percent * 100)
  }, [percent])
  return (
    <div
      className={styles.progress}
      style={
        {
          width,
          height: '6px',
          '--current': `${100 - current}%`,
          ...style,
        } as any
      }
      {...rest}
    >
      {/* <div
        className={styles['real-progress']}
        style={
          {
            width: '100%',
            height: '100%',
          } as any
        }
      /> */}
      <input
        type="range"
        value={current}
        min={0}
        max={100}
        style={{ opacity: 0, width: '100%', height: '100%', zIndex: 2 }}
        onChange={(e) => {
          const newValue = parseFloat(e.target.value)
          setCurrent(newValue)
          onChange(newValue / 100)
        }}
      />
    </div>
  )
}
interface ControlsProps {
  isPlay: boolean
  onPlayPause: (state: PlayState) => void
  isMuted: boolean
  progressPercent: number
  duration: number
  currentTime: number
  volume: number
  onVolumeChange: (vol: number) => void
  onMute: (state: boolean) => void
  onProgressDrag: (currentPercent: number) => void
  onRequestFullScreen?: () => void
  actions?: JSX.Element | JSX.Element[]
  buffered?: number
}
export const Controls: FC<ControlsProps> = memo((props) => {
  const {
    duration,
    currentTime,
    isMuted,
    onMute,
    onProgressDrag,
    onVolumeChange,
    progressPercent,
    volume,
    isPlay,
    onPlayPause,
    onRequestFullScreen,
    buffered,
    actions,
  } = props
  const [inactive, setInactive] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout>(null!)
  useEffect(() => {
    setTimer(
      setTimeout(() => {
        try {
          setInactive(true)
        } catch {}
      }, 2000),
    )
  }, [])
  const handleMouseIn = useCallback(() => {
    clearTimeout(timer)
    setInactive(false)
  }, [timer])
  const handleMouseOut = useCallback(
    () =>
      setTimer(
        setTimeout(() => {
          try {
            setInactive(true)
          } catch {}
        }, 2000),
      ),
    [],
  )
  return (
    <div
      className={classNames(
        styles['control-wrap'],
        inactive && styles.inactive,
      )}
      onMouseOver={handleMouseIn}
      onMouseLeave={handleMouseOut}
    >
      <div className={styles['top-controls']}>
        <div className={styles.left}>
          <div
            className="volume-icon"
            onClick={() => {
              if (isMuted) {
                onMute(false)
              } else {
                onMute(true)
              }
            }}
          >
            {isMuted ? <Mute /> : <Volume />}
          </div>

          <Progress
            percent={volume}
            width="80%"
            onChange={(percent) => {
              onVolumeChange(percent)
            }}
            style={{ marginLeft: '4px' }}
          />
        </div>
        <div className={styles.middle}>
          <span
            onClick={() => {
              onPlayPause(isPlay ? PlayState.Playing : PlayState.Pause)
            }}
          >
            {isPlay ? <Pause /> : <Play />}
          </span>
        </div>
        <div className={styles.right}>
          {onRequestFullScreen && (
            <div
              className="expand"
              onClick={() => {
                onRequestFullScreen()
              }}
            >
              <Expand />
            </div>
          )}
          {actions}
        </div>
      </div>
      <div className={styles['bottom-progress']}>
        <span className={styles.time}>{fancyTimeFormat(currentTime)}</span>
        <div className={styles['progress-wrap']}>
          <Progress
            width="100%"
            onChange={onProgressDrag}
            percent={progressPercent}
          />
          {!!buffered && (
            <div
              className={styles['seek-progress']}
              style={
                {
                  '--seekable': (100 - buffered).toString().concat('%'),
                } as any
              }
            />
          )}
        </div>

        <span className={styles.time}>{fancyTimeFormat(duration)}</span>
      </div>
    </div>
  )
})
