import ShareButton from './ShareButton'

export default function ResultCard({ result, onExcludeRespin, onReset, isSharedView }) {
  return (
    <div className="animate-fade-in flex flex-col items-center gap-5 px-4">
      {isSharedView && (
        <p className="text-text-light text-sm">친구의 룰렛 결과예요!</p>
      )}

      <div className="text-5xl sm:text-6xl font-bold text-primary animate-bounce-in">
        {result.name}
      </div>

      <p className="text-text-light text-base sm:text-lg max-w-sm">
        {result.copy}
      </p>

      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {onExcludeRespin && (
          <button
            onClick={onExcludeRespin}
            className="px-5 py-3 bg-secondary text-white rounded-xl font-medium
              hover:brightness-110 transition-all cursor-pointer"
          >
            이 메뉴 제외하고 다시!
          </button>
        )}
        <ShareButton result={result} />
        <button
          onClick={onReset}
          className="px-5 py-3 bg-primary text-white rounded-xl font-medium
            hover:bg-primary-dark transition-colors cursor-pointer"
        >
          {isSharedView ? '나도 돌려보기' : '처음으로'}
        </button>
      </div>
    </div>
  )
}
