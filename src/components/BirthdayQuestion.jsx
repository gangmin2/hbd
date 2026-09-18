import { useEffect, useState } from 'react'
import { NO_MESSAGES, QUESTIONS, QUESTION_DONE_MESSAGE, SWAP_TRAP_MESSAGE } from '../config.js'
import Doodles from './Doodles.jsx'

const DONE_DELAY = 1800 // 마지막 문구를 보여주는 시간(ms)

function BirthdayQuestion({ onDone }) {
  const [step, setStep] = useState(0) // 몇 번째 질문인지
  const [noCount, setNoCount] = useState(0) // "아니오"를 누른 횟수
  const done = step >= QUESTIONS.length

  useEffect(() => {
    if (!done) return
    const timer = setTimeout(onDone, DONE_DELAY)
    return () => clearTimeout(timer)
  }, [done, onDone])

  const handleYes = () => {
    setStep((s) => s + 1)
    setNoCount(0)
  }

  const handleNo = () => setNoCount((n) => n + 1)

  let noMessage = ''
  if (noCount > 0) {
    noMessage = QUESTIONS[step]?.swap ? SWAP_TRAP_MESSAGE : NO_MESSAGES[(noCount - 1) % NO_MESSAGES.length]
  }

  return (
    <section className="screen question">
      <Doodles />

      <div className="question__card paper">
        {/* key를 바꿔서 질문이 바뀔 때마다 등장 애니메이션을 다시 실행 */}
        <h1 key={step} className="question__text pop-in" aria-live="polite">
          {done ? QUESTION_DONE_MESSAGE : QUESTIONS[step].text}
        </h1>

        {!done && (
          <>
            <div className={`question__buttons ${QUESTIONS[step].swap ? 'question__buttons--swap' : ''}`}>
              <button type="button" className="btn btn--yes" onClick={handleYes}>
                예
              </button>
              <button type="button" className="btn btn--no" onClick={handleNo}>
                아니오
              </button>
            </div>

            <p key={noCount} className={`question__no ${noMessage ? 'shake' : ''}`} aria-live="polite">
              {noMessage}
            </p>
          </>
        )}
      </div>
    </section>
  )
}

export default BirthdayQuestion
