import { useRef, useEffect, useState, useCallback } from 'react'

const COLORS = [
  '#FF6B35', '#FFB347', '#FF8C94', '#91E5F6',
  '#84D2F6', '#59C9A5', '#F7DC6F', '#BB8FCE',
  '#F1948A', '#82E0AA', '#F8C471', '#85C1E9',
  '#E8DAEF', '#A3E4D7', '#FAD7A0', '#AED6F1',
]

export default function Roulette({ menus, isSpinning, targetIndex, onSpinEnd }) {
  const canvasRef = useRef(null)
  const rotationRef = useRef(0)
  const animationRef = useRef(null)
  const menusRef = useRef(menus)

  // 메뉴가 바뀔 때 ref 갱신 + 초기 그리기
  useEffect(() => {
    menusRef.current = menus
    drawWheel(rotationRef.current)
  }, [menus])

  // 캔버스 크기 변경 대응
  useEffect(() => {
    drawWheel(rotationRef.current)
  }, [])

  useEffect(() => {
    if (!isSpinning || targetIndex < 0 || menus.length === 0) return

    const sliceAngle = 360 / menus.length
    // 포인터는 상단(270도 위치). 해당 슬라이스의 중앙이 270도에 오도록 계산
    const targetAngle = 270 - (targetIndex * sliceAngle + sliceAngle / 2)
    // 약간의 랜덤 오프셋 (슬라이스 안에서 위치 변동, 중앙에서 ±40%)
    const jitter = (Math.random() - 0.5) * sliceAngle * 0.6
    const desiredFinalAngle = ((targetAngle + jitter) % 360 + 360) % 360

    const startRotation = rotationRef.current % 360
    // startRotation을 빼서 현재 위치로부터의 상대 회전량을 계산
    const totalRotation = 360 * 3 + ((desiredFinalAngle - startRotation) % 360 + 360) % 360
    const startTime = performance.now()
    const duration = 5000

    const animate = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOutCubic - 중반부터 글씨가 보이도록 부드러운 감속
      const eased = 1 - Math.pow(1 - progress, 3)
      const currentRotation = startRotation + eased * totalRotation

      rotationRef.current = currentRotation
      drawWheel(currentRotation)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // 스핀 완료 — 결과 콜백
        onSpinEnd(targetIndex, menusRef.current)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isSpinning, targetIndex, menus])

  const drawWheel = useCallback((rot) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const displayMenus = menusRef.current
    if (!displayMenus || displayMenus.length === 0) return

    const ctx = canvas.getContext('2d')
    const size = canvas.width
    const center = size / 2
    const radius = center - 10
    const sliceAngle = (2 * Math.PI) / displayMenus.length

    ctx.clearRect(0, 0, size, size)

    // 외곽 그림자
    ctx.save()
    ctx.beginPath()
    ctx.arc(center, center, radius + 4, 0, 2 * Math.PI)
    ctx.shadowColor = 'rgba(0,0,0,0.15)'
    ctx.shadowBlur = 12
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.restore()

    // 휠 본체
    ctx.save()
    ctx.translate(center, center)
    ctx.rotate((rot * Math.PI) / 180)

    displayMenus.forEach((menu, i) => {
      const startAngle = i * sliceAngle
      const endAngle = startAngle + sliceAngle

      // 슬라이스 배경
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = COLORS[i % COLORS.length]
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.7)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // 텍스트
      ctx.save()
      ctx.rotate(startAngle + sliceAngle / 2)
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#fff'
      const fontSize = Math.max(10, Math.min(14, 200 / displayMenus.length))
      ctx.font = `bold ${fontSize}px -apple-system, sans-serif`
      ctx.shadowColor = 'rgba(0,0,0,0.4)'
      ctx.shadowBlur = 3
      ctx.fillText(menu.name, radius - 14, 0)
      ctx.shadowBlur = 0
      ctx.restore()
    })

    ctx.restore()

    // 포인터 (상단 삼각형) — 더 크고 눈에 띄게
    const pointerY = center - radius - 2
    ctx.beginPath()
    ctx.moveTo(center, pointerY + 22)
    ctx.lineTo(center - 14, pointerY)
    ctx.lineTo(center + 14, pointerY)
    ctx.closePath()
    ctx.fillStyle = '#E85D2C'
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.stroke()

    // 중앙 원
    ctx.beginPath()
    ctx.arc(center, center, 20, 0, 2 * Math.PI)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.strokeStyle = '#E85D2C'
    ctx.lineWidth = 3
    ctx.stroke()

    // 중앙 텍스트
    ctx.fillStyle = '#E85D2C'
    ctx.font = 'bold 11px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('GO', center, center)
  }, [])

  return (
    <div className="relative flex justify-center items-center">
      <canvas
        ref={canvasRef}
        width={360}
        height={360}
        className="w-[300px] h-[300px] sm:w-[360px] sm:h-[360px]"
      />
    </div>
  )
}
