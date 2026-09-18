import { useEffect } from 'react'
import confetti from 'canvas-confetti'

const COLORS = ['#ff9eb5', '#ffd66b', '#9ee6c9', '#9fd3ff', '#c8b6ff', '#ff7a6b']
const DURATION = 4500 // 폭죽이 터지는 시간(ms)

// 화면 곳곳에서 폭죽이 터진다. burstKey가 바뀌면 다시 터진다.
function Confetti({ burstKey = 0 }) {
  useEffect(() => {
    // 작은 화면에서는 입자 수를 줄여서 가볍게
    const scale = window.innerWidth < 600 ? 0.6 : 1
    const base = {
      colors: COLORS,
      startVelocity: 32,
      ticks: 90,
      zIndex: 50,
      disableForReducedMotion: true,
    }

    // 시작할 때 가운데에서 크게 한 번
    confetti({ ...base, particleCount: Math.round(120 * scale), spread: 100, origin: { x: 0.5, y: 0.6 } })

    const end = Date.now() + DURATION
    const interval = setInterval(() => {
      if (Date.now() > end) return clearInterval(interval)
      // 양쪽 위에서 불꽃처럼 톡톡
      confetti({
        ...base,
        particleCount: Math.round(40 * scale),
        spread: 360,
        startVelocity: 24,
        origin: { x: 0.1 + Math.random() * 0.3, y: 0.15 + Math.random() * 0.3 },
      })
      confetti({
        ...base,
        particleCount: Math.round(40 * scale),
        spread: 360,
        startVelocity: 24,
        origin: { x: 0.6 + Math.random() * 0.3, y: 0.15 + Math.random() * 0.3 },
      })
    }, 450)

    return () => {
      clearInterval(interval)
    }
  }, [burstKey])

  // 화면을 떠날 때 남은 폭죽 정리
  useEffect(() => () => confetti.reset(), [])

  return null
}

export default Confetti
