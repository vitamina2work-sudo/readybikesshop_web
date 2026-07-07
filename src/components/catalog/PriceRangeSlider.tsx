import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface PriceRangeSliderProps {
  min: number
  max: number
  valueMin: number
  valueMax: number
  step?: number
  onChange: (min: number, max: number) => void
  className?: string
}

function snapToStep(value: number, min: number, step: number) {
  const steps = Math.round((value - min) / step)
  return min + steps * step
}

export function PriceRangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  step = 1,
  onChange,
  className,
}: PriceRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState<'min' | 'max' | null>(null)

  const safeMin = Math.min(
    Math.max(Number.isFinite(valueMin) ? valueMin : min, min),
    Number.isFinite(valueMax) ? valueMax : max
  )
  const safeMax = Math.max(
    Math.min(Number.isFinite(valueMax) ? valueMax : max, max),
    safeMin
  )

  const span = max - min
  const toPercent = (value: number) => (span === 0 ? 0 : ((value - min) / span) * 100)

  const valueFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current
      if (!track || span === 0) return min

      const rect = track.getBoundingClientRect()
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
      const raw = min + ratio * span
      const snapped = snapToStep(raw, min, step)
      const decimals = String(step).includes('.') ? String(step).split('.')[1]?.length ?? 0 : 0
      return Number(Math.min(max, Math.max(min, snapped)).toFixed(decimals))
    },
    [min, max, span, step]
  )

  useEffect(() => {
    if (!dragging) return

    const onMove = (event: PointerEvent) => {
      const next = valueFromClientX(event.clientX)
      if (dragging === 'min') {
        onChange(Math.min(next, safeMax), safeMax)
      } else {
        onChange(safeMin, Math.max(next, safeMin))
      }
    }

    const onUp = () => setDragging(null)

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [dragging, onChange, safeMin, safeMax, valueFromClientX])

  if (max <= min) return null

  const fillLeft = toPercent(safeMin)
  const fillWidth = toPercent(safeMax) - fillLeft

  const thumbClass =
    'absolute top-1/2 z-10 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-background shadow-md cursor-grab touch-none active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

  const startDrag = (thumb: 'min' | 'max') => (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setDragging(thumb)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target !== trackRef.current) return

    const next = valueFromClientX(event.clientX)
    const distToMin = Math.abs(next - safeMin)
    const distToMax = Math.abs(next - safeMax)

    if (distToMin <= distToMax) {
      onChange(Math.min(next, safeMax), safeMax)
    } else {
      onChange(safeMin, Math.max(next, safeMin))
    }
  }

  return (
    <div className={cn('relative h-8 w-full', className)}>
      <div
        ref={trackRef}
        role="presentation"
        onClick={handleTrackClick}
        className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 cursor-pointer rounded-full bg-muted"
      />
      <div
        role="presentation"
        className="pointer-events-none absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary"
        style={{ left: `${fillLeft}%`, width: `${fillWidth}%` }}
      />
      <button
        type="button"
        role="slider"
        aria-label="Precio mínimo"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={safeMin}
        style={{ left: `${fillLeft}%`, zIndex: dragging === 'min' ? 20 : 10 }}
        onPointerDown={startDrag('min')}
        className={thumbClass}
      />
      <button
        type="button"
        role="slider"
        aria-label="Precio máximo"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={safeMax}
        style={{ left: `${toPercent(safeMax)}%`, zIndex: dragging === 'max' ? 20 : 10 }}
        onPointerDown={startDrag('max')}
        className={thumbClass}
      />
    </div>
  )
}
