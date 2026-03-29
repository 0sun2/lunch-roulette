import { useState, useEffect, useRef } from 'react'

const KAKAO_KEY = import.meta.env.VITE_KAKAO_JS_KEY

export default function ShareButton({ result }) {
  const [copied, setCopied] = useState(false)
  const kakaoReady = useRef(false)

  useEffect(() => {
    if (KAKAO_KEY && window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_KEY)
    }
    kakaoReady.current = !!(window.Kakao && window.Kakao.isInitialized())
  }, [])

  const siteUrl = 'https://our00ping.com/'

  const handleKakao = () => {
    if (!kakaoReady.current) return
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `오늘 점심은 ${result.name}!`,
        description: result.copy || '음식 룰렛으로 메뉴 결정!',
        imageUrl: 'https://our00ping.com/favicon.svg',
        link: { mobileWebUrl: siteUrl, webUrl: siteUrl },
      },
      buttons: [
        {
          title: '나도 돌려보기',
          link: { mobileWebUrl: siteUrl, webUrl: siteUrl },
        },
      ],
    })
  }

  const handleCopy = async () => {
    const text = `오늘 점심 룰렛 결과는... ${result.name}! 🎰\n너도 뭐 먹을지 모르겠으면 → ${siteUrl}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {kakaoReady.current && (
        <button
          onClick={handleKakao}
          className="px-5 py-3 bg-[#FEE500] text-[#191919] rounded-xl font-medium
            hover:brightness-95 transition-all cursor-pointer"
        >
          카카오톡 공유
        </button>
      )}
      <button
        onClick={handleCopy}
        className="px-5 py-3 bg-blue-500 text-white rounded-xl font-medium
          hover:bg-blue-600 transition-colors cursor-pointer"
      >
        {copied ? '복사 완료!' : '링크 복사'}
      </button>
    </>
  )
}
