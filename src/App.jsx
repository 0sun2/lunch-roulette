import { useEffect, useState } from 'react'
import { useRoulette, menuData } from './hooks/useRoulette'
import Roulette from './components/Roulette'
import ThemePreset from './components/ThemePreset'
import ResultCard from './components/ResultCard'
import MenuEditor from './components/MenuEditor'

function App() {
  const {
    selectedTheme,
    setSelectedTheme,
    result,
    isSpinning,
    spin,
    onSpinEnd,
    excludeAndRespin,
    resetAll,
    getFilteredMenus,
    refreshWheelMenus,
    wheelMenus,
    targetIndex,
    addWheelMenu,
    removeWheelMenu,
    increaseWheelMenus,
    decreaseWheelMenus,
    setSharedResult,
    themes,
  } = useRoulette()

  const [isEditing, setIsEditing] = useState(false)
  const [isSharedView, setIsSharedView] = useState(false)

  const filteredMenus = getFilteredMenus()

  // URL 파라미터로 공유 결과 처리
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sharedId = params.get('r')
    if (sharedId) {
      const menu = menuData.find((m) => m.id === sharedId)
      if (menu) {
        setSharedResult(menu)
        setIsSharedView(true)
        return
      }
    }
    refreshWheelMenus()
  }, [])

  // 테마 변경 시 휠 메뉴 세팅
  useEffect(() => {
    if (!isSpinning && !result && !isSharedView) {
      refreshWheelMenus()
    }
  }, [selectedTheme])

  const displayMenus = wheelMenus.length > 0 ? wheelMenus : filteredMenus.slice(0, 16)

  return (
    <div className="min-h-dvh flex flex-col">
      {/* 헤더 */}
      <header className="pt-8 pb-4 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary">
          오늘 뭐 먹지?
        </h1>
        <p className="text-text-light text-sm sm:text-base mt-1">
          오늘 뭐 먹을지, 룰렛에게 맡겨봐
        </p>
      </header>

      <main className="flex-1 flex flex-col items-center gap-6 px-4 pb-8">
        {/* 테마 프리셋 — 결과 나와도 항상 표시 */}
        {!isSpinning && !result && (
          <ThemePreset
            themes={themes}
            selectedTheme={selectedTheme}
            onSelect={setSelectedTheme}
          />
        )}

        {/* 룰렛 — 항상 표시 (결과 나올 때도 유지) */}
        <Roulette
          menus={displayMenus}
          isSpinning={isSpinning}
          targetIndex={targetIndex}
          onSpinEnd={onSpinEnd}
        />

        {/* 메뉴 수 조절 + 편집 */}
        {!result && !isSpinning && (
          <>
            <div className="flex items-center gap-3">
              <button
                onClick={decreaseWheelMenus}
                disabled={displayMenus.length <= 2}
                className="w-9 h-9 rounded-full bg-white border border-gray-300
                  text-lg font-bold text-text hover:border-primary hover:text-primary
                  transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                −
              </button>
              <span className="text-sm text-text-light min-w-[80px] text-center">
                메뉴 {displayMenus.length}개
                {filteredMenus.length > displayMenus.length && (
                  <span className="text-xs text-gray-400"> / {filteredMenus.length}</span>
                )}
              </span>
              <button
                onClick={increaseWheelMenus}
                disabled={displayMenus.length >= filteredMenus.length}
                className="w-9 h-9 rounded-full bg-white border border-gray-300
                  text-lg font-bold text-text hover:border-primary hover:text-primary
                  transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>

            <button
              onClick={() => setIsEditing((v) => !v)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer
                ${isEditing
                  ? 'bg-gray-200 text-text'
                  : 'bg-white text-text border border-gray-300 hover:border-primary hover:text-primary'
                }`}
            >
              {isEditing ? '✕ 편집 닫기' : '✏️ 메뉴 편집'}
            </button>

            {isEditing && (
              <MenuEditor
                menus={displayMenus}
                onAdd={addWheelMenu}
                onRemove={removeWheelMenu}
              />
            )}
          </>
        )}

        {/* 돌리기 버튼 */}
        {!result && !isSpinning && (
          <button
            onClick={() => { setIsEditing(false); spin(); }}
            disabled={displayMenus.length < 2}
            className="px-8 py-4 bg-primary text-white text-lg sm:text-xl font-bold
              rounded-2xl shadow-lg hover:bg-primary-dark hover:shadow-xl
              transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed
              cursor-pointer"
          >
            {displayMenus.length < 2
              ? '메뉴를 2개 이상 넣어주세요'
              : '음식 룰렛 돌리기'}
          </button>
        )}

        {/* 스피닝 중 텍스트 */}
        {isSpinning && (
          <p className="text-lg text-text-light animate-pulse">
            두구두구두구...
          </p>
        )}

        {/* 결과 카드 — 휠 아래에 표시 */}
        {result && !isSpinning && (
          <ResultCard
            result={result}
            onExcludeRespin={isSharedView ? null : excludeAndRespin}
            onReset={() => {
              resetAll()
              setIsSharedView(false)
              window.history.replaceState(null, '', window.location.pathname)
              refreshWheelMenus()
            }}
            isSharedView={isSharedView}
          />
        )}

        {/* 광고 슬롯 자리 */}
        <div className="w-full max-w-md mt-4" id="ad-slot-main"></div>
      </main>

      {/* 애드센스 심사 대비 콘텐츠 섹션 */}
      <section className="max-w-2xl mx-auto px-4 py-10 text-left">
        <h2 className="text-2xl font-bold text-text mb-4">상황별 메뉴 추천 가이드</h2>
        <p className="text-text-light leading-relaxed mb-6">
          매일 반복되는 "오늘 뭐 먹지?" 고민, 누구나 한 번쯤은 겪어봤을 거예요.
          특히 혼밥, 회식, 다이어트, 해장 같은 상황에 따라 선택지가 달라지기 마련이죠.
          이 가이드에서는 상황별로 딱 맞는 메뉴를 추천해 드립니다.
        </p>

        <h3 className="text-lg font-semibold text-text mt-6 mb-2">혼밥할 때 추천 메뉴</h3>
        <p className="text-text-light leading-relaxed mb-4">
          혼자 밥 먹을 때는 간단하면서도 든든한 메뉴가 좋아요. 김치찌개, 된장찌개 같은 찌개류는 혼밥의 정석이죠.
          분식집에서 떡볶이와 김밥을 조합하거나, 라면 한 그릇으로 간단히 해결하는 것도 좋습니다.
          일본 라멘이나 돈까스처럼 1인분 메뉴가 확실한 음식도 혼밥러에게 인기 있는 선택입니다.
        </p>

        <h3 className="text-lg font-semibold text-text mt-6 mb-2">회식 메뉴 고민될 때</h3>
        <p className="text-text-light leading-relaxed mb-4">
          여러 명이 함께 먹을 때는 삼겹살, 갈비 같은 고기구이가 무난합니다.
          탕수육과 짬뽕의 중식 조합이나, 닭갈비, 부대찌개처럼 함께 나눠 먹는 메뉴도 회식에 잘 어울려요.
          분위기를 바꾸고 싶다면 양꼬치나 마라샹궈 같은 색다른 선택도 추천합니다.
        </p>

        <h3 className="text-lg font-semibold text-text mt-6 mb-2">다이어트 중일 때</h3>
        <p className="text-text-light leading-relaxed mb-4">
          칼로리가 걱정될 때는 샐러드, 닭가슴살, 포케 같은 가벼운 메뉴를 선택하세요.
          아사이볼이나 샌드위치도 건강하면서 맛있는 대안이 됩니다.
          중요한 건 맛있게 먹으면서도 건강을 챙기는 균형 잡힌 식사입니다.
        </p>

        <h3 className="text-lg font-semibold text-text mt-6 mb-2">해장이 필요할 때</h3>
        <p className="text-text-light leading-relaxed mb-4">
          전날 과음 후에는 뜨끈한 국물이 최고예요. 해장국, 순대국밥, 콩나물국밥은 해장의 삼대장입니다.
          북어국이나 곰탕, 설렁탕처럼 담백하고 깊은 맛의 국물도 속을 편하게 해줍니다.
          메뉴 결정이 어렵다면 위의 룰렛에서 "해장" 테마를 선택해 보세요!
        </p>
      </section>

      {/* 푸터 */}
      <footer className="text-center py-4 text-xs text-text-light border-t border-gray-200">
        © 2026 오늘 뭐 먹지 룰렛
      </footer>
    </div>
  )
}

export default App
