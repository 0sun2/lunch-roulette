import { useState } from 'react'

export default function ShareButton({ result }) {
  const [copied, setCopied] = useState(false)

  const shareText = `오늘 점심 룰렛 결과는... ${result.name}! 🎰\n너도 뭐 먹을지 모르겠으면 → ${window.location.href}`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '오늘 뭐 먹지 룰렛',
          text: shareText,
          url: window.location.href,
        })
      } catch {
        // 사용자가 공유 취소
      }
    } else {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium
        hover:bg-blue-600 transition-colors cursor-pointer"
    >
      {copied ? '복사 완료!' : '공유하기'}
    </button>
  )
}
