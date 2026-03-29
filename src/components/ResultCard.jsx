import ShareButton from './ShareButton'

export default function ResultCard({ result, onExcludeRespin, onReset }) {
  return (
    <div className="animate-fade-in flex flex-col items-center gap-5 px-4">
      <div className="text-5xl sm:text-6xl font-bold text-primary animate-bounce-in">
        {result.name}
      </div>

      <p className="text-text-light text-base sm:text-lg max-w-sm">
        {result.copy}
      </p>

      <div className="flex flex-wrap justify-center gap-3 mt-2">
        <button
          onClick={onExcludeRespin}
          className="px-5 py-3 bg-secondary text-white rounded-xl font-medium
            hover:brightness-110 transition-all cursor-pointer"
        >
          이 메뉴 제외하고 다시!
        </button>
        <ShareButton result={result} />
        <button
          onClick={onReset}
          className="px-5 py-3 bg-gray-200 text-text rounded-xl font-medium
            hover:bg-gray-300 transition-colors cursor-pointer"
        >
          처음으로
        </button>
      </div>
    </div>
  )
}
