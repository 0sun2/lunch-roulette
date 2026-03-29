import { useState, useCallback } from 'react'
import menuData from '../data/menu.json'

const THEME_PRESETS = {
  혼밥: {
    includeCategories: ['분식', '한식', '일식', '패스트푸드', '샐러드', '동남아'],
    excludeCategories: ['고기구이'],
  },
  회식: {
    includeCategories: ['고기구이', '중식', '야식'],
    excludeCategories: ['패스트푸드', '샐러드', '브런치'],
    includeTag: '회식',
  },
  다이어트: {
    includeCategories: ['샐러드'],
    excludeCategories: ['패스트푸드', '야식', '분식', '고기구이'],
    includeTag: '다이어트',
  },
  해장: {
    includeCategories: ['해장'],
    excludeCategories: [],
    includeTag: '해장',
  },
  브런치: {
    includeCategories: ['브런치'],
    excludeCategories: ['야식', '해장', '고기구이'],
    includeTag: '브런치',
  },
  매운음식: {
    includeCategories: [],
    excludeCategories: [],
    includeTag: '매운',
  },
  야식: {
    includeCategories: ['야식'],
    excludeCategories: ['샐러드', '브런치'],
    includeTag: '야식',
  },
  데이트: {
    includeCategories: ['양식', '브런치'],
    excludeCategories: ['패스트푸드', '분식'],
    includeTag: '데이트',
  },
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function filterMenus(theme, excludedIds) {
  let menus = [...menuData]

  if (theme && THEME_PRESETS[theme]) {
    const preset = THEME_PRESETS[theme]
    menus = menus.filter((item) => {
      const inInclude = preset.includeCategories.includes(item.category)
      const inExclude = preset.excludeCategories.includes(item.category)
      const hasTag = preset.includeTag
        ? item.tags.includes(preset.includeTag)
        : false
      return (inInclude || hasTag) && !inExclude
    })
  }

  menus = menus.filter((item) => !excludedIds.includes(item.id))
  return menus
}

export function useRoulette() {
  const [selectedTheme, setSelectedTheme] = useState(null)
  const [excludedIds, setExcludedIds] = useState([])
  const [result, setResult] = useState(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [targetIndex, setTargetIndex] = useState(-1)
  const [wheelMenus, setWheelMenus] = useState([])

  const getFilteredMenus = useCallback(() => {
    return filterMenus(selectedTheme, excludedIds)
  }, [selectedTheme, excludedIds])

  const refreshWheelMenus = useCallback(() => {
    const filtered = filterMenus(selectedTheme, excludedIds)
    const shuffled = shuffle(filtered).slice(0, 16)
    setWheelMenus(shuffled)
    return shuffled
  }, [selectedTheme, excludedIds])

  // 핵심: 모든 상태를 동기적으로 한번에 세팅
  const spin = useCallback((extraExcludeId = null) => {
    let menusToSpin

    if (extraExcludeId) {
      // "제외하고 다시" → 현재 휠에서 해당 메뉴만 빼고 새로 구성
      const newExcluded = [...excludedIds, extraExcludeId]
      const filtered = filterMenus(selectedTheme, newExcluded)
      if (filtered.length === 0) return null
      menusToSpin = shuffle(filtered).slice(0, 16)
      setExcludedIds(newExcluded)
      setWheelMenus(menusToSpin)
    } else {
      // 첫 돌리기 → 사용자가 편집한 wheelMenus를 그대로 사용
      menusToSpin = wheelMenus
      if (menusToSpin.length === 0) return null
    }

    const chosenIndex = Math.floor(Math.random() * menusToSpin.length)

    setTargetIndex(chosenIndex)
    setResult(null)
    setIsSpinning(true)

    return menusToSpin[chosenIndex]
  }, [selectedTheme, excludedIds, wheelMenus])

  const onSpinEnd = useCallback((index, menus) => {
    setResult(menus[index])
    setIsSpinning(false)
  }, [])

  const excludeAndRespin = useCallback(() => {
    if (result) {
      spin(result.id)
    }
  }, [result, spin])

  const addWheelMenu = useCallback((name) => {
    const id = 'custom-' + Date.now()
    const newMenu = { id, name, category: '커스텀', tags: [], copy: '', image: '' }
    setWheelMenus((prev) => [...prev, newMenu])
  }, [])

  const removeWheelMenu = useCallback((index) => {
    setWheelMenus((prev) => prev.filter((_, i) => i !== index))
  }, [])

  // 휠 메뉴 10개 늘리기 — 풀에서 중복 없이 추가
  const increaseWheelMenus = useCallback(() => {
    const filtered = filterMenus(selectedTheme, excludedIds)
    setWheelMenus((prev) => {
      const currentIds = new Set(prev.map((m) => m.id))
      const remaining = filtered.filter((m) => !currentIds.has(m.id))
      const toAdd = shuffle(remaining).slice(0, 10)
      return [...prev, ...toAdd]
    })
  }, [selectedTheme, excludedIds])

  // 휠 메뉴 10개 줄이기 — 최소 2개 유지
  const decreaseWheelMenus = useCallback(() => {
    setWheelMenus((prev) => {
      const newLen = Math.max(2, prev.length - 10)
      return prev.slice(0, newLen)
    })
  }, [])

  const resetAll = useCallback(() => {
    setResult(null)
    setSelectedTheme(null)
    setExcludedIds([])
    setIsSpinning(false)
    setTargetIndex(-1)
    setWheelMenus([])
  }, [])

  return {
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
    themes: Object.keys(THEME_PRESETS),
  }
}
