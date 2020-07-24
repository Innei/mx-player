# mx-player

> A simple lovely player.

[![NPM](https://img.shields.io/npm/v/mx-player.svg)](https://www.npmjs.com/package/mx-player) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save mx-player
# or
yarn add mx-player
```

## Demo

TODO

## Usage

```tsx
import 'mx-player/dist/index.css'
import { Player } from 'mx-player'

const App = () => {
  return <Player src={src} />
}
```

## Interface

```ts
interface PlayerProps {
  maxHeight?: number
  maxWidth?: number
  src: string
  height?: number
  width?: number
}
export declare const Player: React.FC<
  PlayerProps &
    Omit<
      React.DetailedHTMLProps<
        React.VideoHTMLAttributes<HTMLVideoElement>,
        HTMLVideoElement
      >,
      'height' | 'width'
    >
>
```

## License

MIT © [Innei](https://github.com/Innei)
