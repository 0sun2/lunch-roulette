import { useState } from 'react'

export default function MenuEditor({ menus, onAdd, onRemove }) {
  const [newName, setNewName] = useState('')

  const handleAdd = () => {
    const name = newName.trim()
    if (!name) return
    onAdd(name)
    setNewName('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <div className="w-full max-w-md animate-fade-in">
      {/* 추가 입력 */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메뉴 이름 입력"
          maxLength={20}
          className="flex-1 px-3 py-2 rounded-xl border border-gray-300
            focus:outline-none focus:border-primary text-sm"
        />
        <button
          onClick={handleAdd}
          disabled={!newName.trim()}
          className="px-4 py-2 bg-primary text-white font-bold rounded-xl
            hover:bg-primary-dark transition-colors cursor-pointer
            disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          + 추가
        </button>
      </div>

      {/* 메뉴 목록 */}
      <div className="flex flex-wrap gap-2">
        {menus.map((menu, i) => (
          <span
            key={menu.id + '-' + i}
            className="inline-flex items-center gap-1 px-3 py-1.5
              bg-white border border-gray-200 rounded-full text-sm shadow-sm"
          >
            {menu.name}
            <button
              onClick={() => onRemove(i)}
              className="ml-0.5 w-5 h-5 flex items-center justify-center
                rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500
                transition-colors cursor-pointer text-xs font-bold"
            >
              -
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}
