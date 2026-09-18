import { useCallback, useEffect, useRef, useState } from 'react'
import { MIC_THRESHOLD } from '../config.js'

// 마이크로 "후~" 부는 소리를 감지하는 훅.
// status: 'idle' | 'requesting' | 'listening' | 'denied' | 'unsupported' | 'error'
//
// 감지 방식
// - 시작 직후 0.6초 동안 주변 소음 크기를 재서 기준값을 잡는다.
// - 소리 크기(RMS)가 max(MIC_THRESHOLD, 기준값 x 3)을 넘는 상태가
//   연속 SUSTAIN_FRAMES 프레임(약 0.15초) 이어지면 "후~"로 본다.
// - 한 번 감지한 뒤에는 COOLDOWN 동안 다시 감지하지 않는다.
const CALIBRATE_MS = 600
const SUSTAIN_FRAMES = 9
const COOLDOWN_MS = 700

export default function useMicrophoneBlow(onBlow) {
  const [status, setStatus] = useState('idle')
  const [level, setLevel] = useState(0) // 0~1, 화면 표시용

  const onBlowRef = useRef(onBlow)
  const resRef = useRef(null) // { stream, ctx, raf }
  const aliveRef = useRef(true) // 컴포넌트가 아직 화면에 있는지

  useEffect(() => {
    onBlowRef.current = onBlow
  }, [onBlow])

  const stop = useCallback(() => {
    const res = resRef.current
    if (!res) return
    cancelAnimationFrame(res.raf)
    res.stream.getTracks().forEach((t) => t.stop())
    res.ctx.close().catch(() => {})
    resRef.current = null
    setLevel(0)
  }, [])

  const start = useCallback(async () => {
    if (resRef.current) return
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!navigator.mediaDevices?.getUserMedia || !AudioCtx) {
      setStatus('unsupported')
      return
    }

    setStatus('requesting')
    let stream
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: false },
      })
    } catch (err) {
      setStatus(err?.name === 'NotAllowedError' || err?.name === 'SecurityError' ? 'denied' : 'error')
      return
    }
    if (!aliveRef.current || resRef.current) {
      // 권한 요청 중에 화면이 바뀌었거나 이미 듣고 있음
      stream.getTracks().forEach((t) => t.stop())
      return
    }

    try {
      const ctx = new AudioCtx()
      const res = { stream, ctx, raf: 0 }
      resRef.current = res
      await ctx.resume()
      if (resRef.current !== res) return // 그 사이 stop() 됨

      const analyser = ctx.createAnalyser()
      analyser.fftSize = 1024
      ctx.createMediaStreamSource(stream).connect(analyser)
      const data = new Float32Array(analyser.fftSize)

      const startedAt = performance.now()
      let baseline = 0
      let baselineSamples = 0
      let loudFrames = 0
      let lastBlowAt = 0
      let frame = 0

      const tick = () => {
        analyser.getFloatTimeDomainData(data)
        let sum = 0
        for (let i = 0; i < data.length; i++) sum += data[i] * data[i]
        const rms = Math.sqrt(sum / data.length)
        const now = performance.now()

        if (now - startedAt < CALIBRATE_MS) {
          // 주변 소음 측정
          baseline = (baseline * baselineSamples + rms) / (baselineSamples + 1)
          baselineSamples++
        } else {
          const threshold = Math.max(MIC_THRESHOLD, baseline * 3)
          loudFrames = rms > threshold ? loudFrames + 1 : 0
          if (loudFrames >= SUSTAIN_FRAMES && now - lastBlowAt > COOLDOWN_MS) {
            lastBlowAt = now
            loudFrames = 0
            onBlowRef.current?.()
          }
        }

        // 화면 표시용 레벨은 몇 프레임마다 갱신 (불필요한 리렌더 줄이기)
        if (frame++ % 4 === 0) setLevel(Math.min(1, rms / (MIC_THRESHOLD * 1.6)))
        res.raf = requestAnimationFrame(tick)
      }

      setStatus('listening')
      res.raf = requestAnimationFrame(tick)
    } catch {
      stop()
      stream.getTracks().forEach((t) => t.stop())
      setStatus('error')
    }
  }, [stop])

  // 화면을 벗어나면 마이크를 반드시 끈다
  useEffect(() => {
    aliveRef.current = true
    return () => {
      aliveRef.current = false
      stop()
    }
  }, [stop])

  return { status, level, start, stop }
}
