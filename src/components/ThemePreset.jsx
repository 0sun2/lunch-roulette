const THEME_ICONS = {
  혼밥: '🍚',
  회식: '🍻',
  다이어트: '🥗',
  해장: '🍲',
  브런치: '🥐',
  매운음식: '🌶️',
  야식: '🌙',
  데이트: '💕',
}

export default function ThemePreset({ themes, selectedTheme, onSelect }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
      {themes.map((theme) => (
        <button
          key={theme}
          onClick={() => onSelect(selectedTheme === theme ? null : theme)}
          className={`
            px-4 py-2 rounded-full text-sm sm:text-base font-medium
            transition-all duration-200 cursor-pointer
            ${
              selectedTheme === theme
                ? 'bg-primary text-white shadow-md scale-105'
                : 'bg-white text-text border border-gray-200 hover:border-primary hover:text-primary'
            }
          `}
        >
          <span className="mr-1">{THEME_ICONS[theme]}</span>
          {theme}
        </button>
      ))}
    </div>
  )
}
