import { useCallback, useEffect, useRef, useState } from 'react'
import { MUSIC_SRC } from '../config.js'

// 생일 축하 노래 재생 훅.
// 1) MUSIC_SRC 음악 파일 재생을 시도하고
// 2) 파일이 없거나 재생에 실패하면 Web Audio로 만든 오르골 멜로디를 재생한다.
// 어떤 경우에도 에러를 밖으로 던지지 않아서 전체 흐름이 멈추지 않는다.

// Happy Birthday 멜로디 (퍼블릭 도메인) — [음 이름, 박자]
const MELODY = [
  ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
  ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
  ['G4', 0.75], ['G4', 0.25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 2],
  ['F5', 0.75], ['F5', 0.25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 3],
]
const BEAT = 0.42 // 한 박자 길이(초)
const LOOP_GAP = 1.2 // 반복 사이 쉬는 시간(초)

const NOTE_INDEX = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 }
const noteToFreq = (note) => {
  const semitones = NOTE_INDEX[note[0]] + (Number(note[1]) - 4) * 12
  return 440 * 2 ** (semitones / 12)
}

export default function useBirthdaySong() {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)

  const audioRef = useRef(null) // 음악 파일용 <audio>
  const fileFailedRef = useRef(false) // 파일 재생이 한 번 실패하면 이후엔 바로 멜로디로
  const synthRef = useRef(null) // { ctx, master, timer, nodes }
  const mutedRef = useRef(false)

  // ---------- 오르골 멜로디 ----------
  const stopSynth = useCallback(() => {
    const synth = synthRef.current
    if (!synth) return
    clearTimeout(synth.timer)
    synth.nodes.forEach((osc) => {
      try {
        osc.stop()
      } catch {
        /* 이미 멈춘 노드 */
      }
    })
    synth.nodes = []
  }, [])

  // 클릭 이벤트 안에서 동기적으로 호출해야 iOS Safari에서도 소리가 난다
  const ensureSynth = useCallback(() => {
    if (synthRef.current) return synthRef.current
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return null
    try {
      const ctx = new AudioCtx()
      const master = ctx.createGain()
      master.connect(ctx.destination)
      synthRef.current = { ctx, master, timer: null, nodes: [] }
      ctx.resume().catch(() => {})
    } catch {
      return null
    }
    return synthRef.current
  }, [])

  const playSynth = useCallback(async () => {
    const synth = ensureSynth()
    if (!synth) return false
    stopSynth()
    try {
      await synth.ctx.resume()
    } catch {
      return false
    }
    if (synth.ctx.state !== 'running') return false
    synth.master.gain.value = mutedRef.current ? 0 : 0.18

    const scheduleOnce = () => {
      const { ctx, master } = synth
      let t = ctx.currentTime + 0.05
      MELODY.forEach(([note, beats]) => {
        const dur = beats * BEAT
        const freq = noteToFreq(note)
        // 삼각파 + 한 옥타브 위 사인파를 섞어 오르골 같은 소리
        ;[['triangle', freq, 1], ['sine', freq * 2, 0.25]].forEach(([type, f, vol]) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = type
          osc.frequency.value = f
          gain.gain.setValueAtTime(0.0001, t)
          gain.gain.exponentialRampToValueAtTime(vol, t + 0.02)
          gain.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(dur * 0.95, 0.3))
          osc.connect(gain).connect(master)
          osc.start(t)
          osc.stop(t + dur + 0.05)
          synth.nodes.push(osc)
        })
        t += dur
      })
      const total = t - ctx.currentTime
      synth.timer = setTimeout(() => {
        synth.nodes = []
        scheduleOnce()
      }, (total + LOOP_GAP) * 1000)
    }

    scheduleOnce()
    return true
  }, [ensureSynth, stopSynth])

  // ---------- 음악 파일 ----------
  const playFile = useCallback(async () => {
    if (fileFailedRef.current) return false
    try {
      if (!audioRef.current) {
        const audio = new Audio(MUSIC_SRC)
        audio.loop = true
        audio.volume = 0.7
        audioRef.current = audio
      }
      audioRef.current.muted = mutedRef.current
      await audioRef.current.play()
      return true
    } catch (err) {
      // 자동재생 차단(NotAllowedError)이 아니면 파일이 없거나 깨진 것 → 이후 멜로디 사용
      if (err?.name !== 'NotAllowedError') fileFailedRef.current = true
      return false
    }
  }, [])

  // ---------- 외부에 제공하는 함수 ----------
  const play = useCallback(async () => {
    ensureSynth() // 파일 재생이 실패할 때를 대비해 미리 깨워둔다
    const ok = (await playFile()) || (await playSynth())
    setPlaying(ok)
    return ok
  }, [ensureSynth, playFile, playSynth])

  const stop = useCallback(() => {
    audioRef.current?.pause()
    stopSynth()
    setPlaying(false)
  }, [stopSynth])

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current
    mutedRef.current = next
    setMuted(next)
    if (audioRef.current) audioRef.current.muted = next
    if (synthRef.current) synthRef.current.master.gain.value = next ? 0 : 0.18
  }, [])

  // 페이지를 떠날 때 정리
  useEffect(() => {
    return () => {
      audioRef.current?.pause()
      stopSynth()
      synthRef.current?.ctx.close().catch(() => {})
      synthRef.current = null
    }
  }, [stopSynth])

  return { playing, muted, play, stop, toggleMute }
}
