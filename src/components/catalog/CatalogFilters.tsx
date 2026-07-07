import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Category } from '@/types/database'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { PriceRangeSlider } from '@/components/catalog/PriceRangeSlider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export interface CatalogFiltersState {
  categoryId: string
  minPrice: string
  maxPrice: string
  onSaleOnly: boolean
}

interface CatalogFiltersProps {
  categories: Category[]
  filters: CatalogFiltersState
  priceBounds: { min: number; max: number }
  onChange: (filters: CatalogFiltersState) => void
}

function formatPriceValue(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2)
}

export function CatalogFilters({
  categories,
  filters,
  priceBounds,
  onChange,
}: CatalogFiltersProps) {
  const { t } = useTranslation()

  const step = useMemo(() => {
    const span = priceBounds.max - priceBounds.min
    if (span <= 50) return 0.01
    if (span <= 200) return 1
    return 5
  }, [priceBounds])

  const sliderMin = (() => {
    if (filters.minPrice === '') return priceBounds.min
    const n = parseFloat(filters.minPrice)
    return Number.isFinite(n) ? n : priceBounds.min
  })()
  const sliderMax = (() => {
    if (filters.maxPrice === '') return priceBounds.max
    const n = parseFloat(filters.maxPrice)
    return Number.isFinite(n) ? n : priceBounds.max
  })()

  const update = (partial: Partial<CatalogFiltersState>) =>
    onChange({ ...filters, ...partial })

  const setPriceRange = (min: number, max: number) => {
    const atFullRange = min <= priceBounds.min && max >= priceBounds.max
    update({
      minPrice: atFullRange ? '' : formatPriceValue(min),
      maxPrice: atFullRange ? '' : formatPriceValue(max),
    })
  }

  const hasActiveFilters =
    filters.categoryId !== 'all' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.onSaleOnly

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm">{t('catalog.filters')}</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onChange({ categoryId: 'all', minPrice: '', maxPrice: '', onSaleOnly: false })
            }
          >
            <X className="size-3" />
            {t('catalog.clear')}
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label>{t('catalog.category')}</Label>
        <Select value={filters.categoryId} onValueChange={(v) => update({ categoryId: v })}>
          <SelectTrigger>
            <SelectValue placeholder={t('catalog.allCategories')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('catalog.allCategories')}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>{t('catalog.priceRange')}</Label>
        <PriceRangeSlider
          min={priceBounds.min}
          max={priceBounds.max}
          step={step}
          valueMin={Math.min(sliderMin, sliderMax)}
          valueMax={Math.max(sliderMin, sliderMax)}
          onChange={setPriceRange}
        />
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
              {t('catalog.minPrice')}
            </Label>
            <Input
              id="minPrice"
              type="number"
              min={priceBounds.min}
              max={priceBounds.max}
              step={step}
              placeholder={String(priceBounds.min)}
              value={filters.minPrice}
              onChange={(e) => {
                const raw = e.target.value
                if (raw === '') {
                  update({ minPrice: '' })
                  return
                }
                const num = parseFloat(raw)
                if (Number.isNaN(num)) return
                const clamped = Math.min(Math.max(num, priceBounds.min), sliderMax)
                setPriceRange(clamped, sliderMax)
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
              {t('catalog.maxPrice')}
            </Label>
            <Input
              id="maxPrice"
              type="number"
              min={priceBounds.min}
              max={priceBounds.max}
              step={step}
              placeholder={String(priceBounds.max)}
              value={filters.maxPrice}
              onChange={(e) => {
                const raw = e.target.value
                if (raw === '') {
                  update({ maxPrice: '' })
                  return
                }
                const num = parseFloat(raw)
                if (Number.isNaN(num)) return
                const clamped = Math.max(Math.min(num, priceBounds.max), sliderMin)
                setPriceRange(sliderMin, clamped)
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="onSale"
          checked={filters.onSaleOnly}
          onCheckedChange={(checked) => update({ onSaleOnly: checked === true })}
        />
        <Label htmlFor="onSale" className="cursor-pointer">
          {t('catalog.onSaleOnly')}
        </Label>
      </div>
    </div>
  )
}
