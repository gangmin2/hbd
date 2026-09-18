import { useEffect, useState } from 'react'
import BirthdayQuestion from './components/BirthdayQuestion.jsx'
import SecretRoom from './components/SecretRoom.jsx'
import BirthdayScene from './components/BirthdayScene.jsx'
import Celebration from './components/Celebration.jsx'
import useBirthdaySong from './hooks/useBirthdaySong.js'
import './App.css'

// 화면 흐름
// question → secretRoom → doorOpening → birthdayScene → celebration
const DOOR_OPEN_DURATION = 2300 // 문 열림 + 빛 번짐 애니메이션 시간(ms)

function App() {
  const [stage, setStage] = useState('question')
  const song = useBirthdaySong()

  // 문이 열리는 애니메이션이 끝나면 케이크 화면으로
  useEffect(() => {
    if (stage !== 'doorOpening') return
    const timer = setTimeout(() => setStage('birthdayScene'), DOOR_OPEN_DURATION)
    return () => clearTimeout(timer)
  }, [stage])

  const openDoor = () => {
    setStage('doorOpening')
    // 손잡이 클릭(사용자 동작) 시점에 노래를 시작해야 자동재생 차단을 피할 수 있다.
    song.play()
  }

  const restart = () => {
    song.stop()
    setStage('question')
  }

  const isDark = stage === 'secretRoom' || stage === 'doorOpening'

  return (
    <main className={`app ${isDark ? 'app--dark' : ''}`}>
      <RoughFilter />

      {stage === 'question' && (
        <BirthdayQuestion onDone={() => setStage('secretRoom')} />
      )}

      {isDark && <SecretRoom opening={stage === 'doorOpening'} onOpen={openDoor} />}

      {stage === 'birthdayScene' && (
        <BirthdayScene song={song} onAllCandlesOut={() => setStage('celebration')} />
      )}

      {stage === 'celebration' && <Celebration song={song} onRestart={restart} />}
    </main>
  )
}

// SVG 선을 살짝 삐뚤빼뚤하게 만들어 손그림 느낌을 주는 필터.
// 다른 SVG에서 filter="url(#rough)" 로 사용한다.
function RoughFilter() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <filter id="rough">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" />
        <feDisplacementMap in="SourceGraphic" scale="3.5" />
      </filter>
    </svg>
  )
}

export default App
