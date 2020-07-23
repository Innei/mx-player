/*
 * @Author: Innei
 * @Date: 2020-07-23 14:40:05
 * @LastEditTime: 2020-07-23 20:48:54
 * @LastEditors: Innei
 * @FilePath: /mx-player/src/components/controls/index.tsx
 * @Coding with Love
 */

import React, { FC, useState } from 'react'
import { Ellipsis, Expand, Play, Volume } from '../../icons'
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
  const [current, setCurrent] = useState(percent * 100)
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
  isMuted: boolean
  progressPercent: number
  duration: string
  currentTime: string
  volume: number
  onVolumeChange: (vol: number) => void
  onMute: (state: boolean) => void
  onProgressDrag: (currentPercent: number) => void
}
export const Controls: FC<ControlsProps> = (props) => {
  const {
    duration,
    currentTime,
    isMuted,
    onMute,
    onProgressDrag,
    onVolumeChange,
    progressPercent,
    volume,
  } = props

  return (
    <div className={styles['control-wrap']}>
      <div className={styles['top-controls']}>
        <div className={styles.left}>
          <Volume
            onClick={() => {
              if (isMuted) {
                onMute(false)
              } else {
                onMute(true)
              }
            }}
          />
          <Progress
            percent={volume}
            width="80%"
            onChange={(percent) => {
              onVolumeChange(percent * 100)
            }}
            style={{ marginLeft: '4px' }}
          />
        </div>
        <div className={styles.middle}>
          <Play />
        </div>
        <div className={styles.right}>
          <Expand />
          <Ellipsis />
        </div>
      </div>
      <div className={styles['bottom-progress']}>
        <span className={styles.time}>{currentTime}</span>
        <Progress
          width="100%"
          onChange={onProgressDrag}
          percent={progressPercent}
        />
        <span className={styles.time}>{duration}</span>
      </div>
    </div>
  )
}
