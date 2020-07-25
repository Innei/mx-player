import React, { FC } from 'react'
import ReactDOM from 'react-dom'
import styles from './styles.module.css'

export interface MenuType {
  name: string
  onClink?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}
export interface MenuProps {
  items: MenuType[]
  position: { x: number; y: number }
}

const _Menu: FC<MenuProps> = (props) => {
  const {
    items,
    position: { x, y },
  } = props
  return (
    <div className={styles['menu-wrap']} style={{ top: y, left: x }}>
      {items.map((item) => {
        return (
          <div
            className={styles['menu-item']}
            key={item.name}
            onClick={item.onClink}
          >
            {item.name}
          </div>
        )
      })}
    </div>
  )
}

export const Menu: FC<MenuProps> = (props) => {
  // @ts-ignore
  return ReactDOM.createPortal(React.createElement(_Menu, props), document.body)
}
