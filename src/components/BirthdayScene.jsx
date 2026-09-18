import { useCallback, useEffect, useState } from 'react'
import { CANDLE_COUNT, CANDLES_PER_BLOW } from '../config.js'
import Cake from './Cake.jsx'
import CandleBlowControl from './CandleBlowControl.jsx'
import MusicControl from './MusicControl.jsx'
import Bunting from './Bunting.jsx'
import Doodles from './Doodles.jsx'

const WISH_DELAY = 1800 // 마지막 촛불이 꺼진 뒤 축하 화면까지 기다리는 시간(ms)

// 켜진 촛불 중 랜덤으로 count개를 끈다
function blowOutRandom(litCandles, count) {
  const litIndexes = litCandles.flatMap((lit, i) => (lit ? [i] : []))
  const targets = new Set()
  while (targets.size < Math.min(count, litIndexes.length)) {
    targets.add(litIndexes[Math.floor(Math.random() * litIndexes.length)])
  }
  return litCandles.map((lit, i) => lit && !targets.has(i))
}

function BirthdayScene({ song, onAllCandlesOut }) {
  // 촛불 하나하나의 상태 (true = 켜짐)
  const [litCandles, setLitCandles] = useState(() => Array(CANDLE_COUNT).fill(true))

  const litCount = litCandles.filter(Boolean).length
  const outCount = CANDLE_COUNT - litCount
  const allOut = litCount === 0

  const blow = useCallback(() => {
    const { min, max } = CANDLES_PER_BLOW
    const count = min + Math.floor(Math.random() * (max - min + 1))
    setLitCandles((prev) => blowOutRandom(prev, count))
  }, [])

  // 모든 촛불이 꺼지면 소원 빌 시간을 조금 주고 다음 단계로
  useEffect(() => {
    if (!allOut) return
    const timer = setTimeout(onAllCandlesOut, WISH_DELAY)
    return () => clearTimeout(timer)
  }, [allOut, onAllCandlesOut])

  let guide = '케이크에 대고 촛불을 불어서 꺼주세요!'
  if (allOut) guide = '소원 빌었지오?'
  else if (outCount > 0) guide = `${litCount}개 남았어요! 한 번 더 후~`

  return (
    <section className="screen scene">
      <Bunting />
      <Doodles />

      <header className="scene__header">
        <h1 className="scene__title">두둥! 🎂</h1>
        <p className="scene__guide" aria-live="polite">
          {guide}
        </p>
      </header>

      <div className={`scene__cake ${allOut ? 'scene__cake--done' : ''}`}>
        <Cake litCandles={litCandles} />
      </div>

      <div className="scene__controls">
        <CandleBlowControl onBlow={blow} disabled={allOut}>
          <MusicControl song={song} />
        </CandleBlowControl>
      </div>
    </section>
  )
}

export default BirthdayScene
