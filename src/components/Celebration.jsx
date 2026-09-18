import { useState } from 'react'
import { CANDLE_COUNT, CELEBRATION } from '../config.js'
import Cake from './Cake.jsx'
import Confetti from './Confetti.jsx'
import MusicControl from './MusicControl.jsx'
import Bunting from './Bunting.jsx'
import Doodles from './Doodles.jsx'

const ALL_OUT = Array(CANDLE_COUNT).fill(false)

function Celebration({ song, onRestart }) {
  const [burstKey, setBurstKey] = useState(0)

  return (
    <section className="screen celebration">
      <Confetti burstKey={burstKey} />
      <Bunting />
      <Doodles />

      <div className="celebration__text">
        <h1 className="celebration__title">{CELEBRATION.title}</h1>
        <p className="celebration__message">
          <span>{CELEBRATION.message}</span>
        </p>
        <p className="celebration__sub">{CELEBRATION.sub}</p>
      </div>

      <div className="celebration__cake">
        <Cake litCandles={ALL_OUT} />
      </div>

      <div className="celebration__buttons">
        <button type="button" className="btn btn--yes" onClick={() => setBurstKey((k) => k + 1)}>
          폭죽 한 번 더!
        </button>
        <MusicControl song={song} />
        <button type="button" className="btn btn--small" onClick={onRestart}>
          ↺ 처음부터 다시
        </button>
      </div>
    </section>
  )
}

export default Celebration
