import { useEffect, useState } from 'react'
import useMicrophoneBlow from '../hooks/useMicrophoneBlow.js'

// 촛불 끄기 컨트롤
// - 버튼: 항상 동작하는 기본 방식
// - 마이크: 선택 기능. 실패해도 버튼은 그대로 쓸 수 있다.
const MIC_MESSAGES = {
  requesting: '마이크 권한을 허용해 주세요...',
  listening: '듣고 있어요! 화면에 대고 "후~" 하고 불어보세요.',
  denied: '마이크 권한이 거부됐어요. 위 버튼으로 불어주세요!',
  unsupported: '이 브라우저에서는 마이크를 쓸 수 없어요. 위 버튼으로 불어주세요!',
  error: '마이크를 켜지 못했어요. 위 버튼으로 불어주세요!',
}

// children: 마이크 버튼 옆에 함께 놓을 요소 (예: 음악 버튼)
function CandleBlowControl({ onBlow, disabled, children }) {
  const [showMicInfo, setShowMicInfo] = useState(false)
  const mic = useMicrophoneBlow(onBlow)
  const stopMic = mic.stop

  // 촛불을 다 끄면 마이크도 끈다
  useEffect(() => {
    if (disabled) stopMic()
  }, [disabled, stopMic])

  const listening = mic.status === 'listening'

  return (
    <div className="blow">
      <button type="button" className="btn btn--blow" onClick={onBlow} disabled={disabled}>
        버튼으로 촛불 끄기
      </button>

      <div className="blow__row">
        {!disabled && mic.status === 'idle' && !showMicInfo && (
          <button type="button" className="btn btn--small" onClick={() => setShowMicInfo(true)}>
            🎤 후~ 불어서 촛불 끄기
          </button>
        )}
        {children}
      </div>

      {!disabled && mic.status === 'idle' && showMicInfo && (
        <div className="blow__info paper">
          <p>
            마이크를 켜면 화면에 대고 <b>"후~"</b> 불어서 촛불을 끌 수 있어요.
          </p>
          <button type="button" className="btn btn--small" onClick={mic.start}>
            마이크 켜기
          </button>
        </div>
      )}

      {!disabled && mic.status !== 'idle' && (
        <div className="blow__status" aria-live="polite">
          <p>{MIC_MESSAGES[mic.status]}</p>
          {listening && (
            <div className="meter" aria-hidden="true">
              <div className="meter__bar" style={{ transform: `scaleX(${mic.level})` }} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CandleBlowControl
