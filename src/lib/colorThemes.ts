export type ColorThemeId = 'classic' | 'garage' | 'racing'

export const COLOR_THEME_IDS: ColorThemeId[] = ['classic', 'garage', 'racing']

type CssVars = Record<string, string>

export interface ColorTheme {
  id: ColorThemeId
  swatch: { primary: string; background: string }
  light: CssVars
  dark: CssVars
}

/** Coherent palettes — light + dark variants per theme */
export const colorThemes: Record<ColorThemeId, ColorTheme> = {
  classic: {
    id: 'classic',
    swatch: { primary: '#E85D2C', background: '#F8F9FC' },
    light: {
      '--background': 'oklch(0.985 0.002 247)',
      '--foreground': 'oklch(0.145 0.02 265)',
      '--card': 'oklch(1 0 0)',
      '--card-foreground': 'oklch(0.145 0.02 265)',
      '--primary': 'oklch(0.55 0.22 25)',
      '--primary-foreground': 'oklch(0.985 0 0)',
      '--secondary': 'oklch(0.96 0.005 265)',
      '--muted': 'oklch(0.96 0.005 265)',
      '--muted-foreground': 'oklch(0.5 0.02 265)',
      '--accent': 'oklch(0.96 0.01 265)',
      '--border': 'oklch(0.9 0.005 265)',
      '--ring': 'oklch(0.55 0.22 25)',
    },
    dark: {
      '--background': 'oklch(0.13 0.015 265)',
      '--foreground': 'oklch(0.985 0.002 247)',
      '--card': 'oklch(0.17 0.015 265)',
      '--card-foreground': 'oklch(0.985 0.002 247)',
      '--primary': 'oklch(0.62 0.22 25)',
      '--primary-foreground': 'oklch(0.985 0 0)',
      '--secondary': 'oklch(0.22 0.015 265)',
      '--muted': 'oklch(0.22 0.015 265)',
      '--muted-foreground': 'oklch(0.65 0.02 265)',
      '--accent': 'oklch(0.22 0.015 265)',
      '--border': 'oklch(1 0 0 / 10%)',
      '--ring': 'oklch(0.62 0.22 25)',
    },
  },
  garage: {
    id: 'garage',
    swatch: { primary: '#D4A012', background: '#1A1A1F' },
    light: {
      '--background': 'oklch(0.97 0.008 80)',
      '--foreground': 'oklch(0.2 0.02 80)',
      '--card': 'oklch(0.99 0.005 80)',
      '--card-foreground': 'oklch(0.2 0.02 80)',
      '--primary': 'oklch(0.62 0.14 75)',
      '--primary-foreground': 'oklch(0.15 0.02 80)',
      '--secondary': 'oklch(0.93 0.01 80)',
      '--muted': 'oklch(0.93 0.01 80)',
      '--muted-foreground': 'oklch(0.48 0.02 80)',
      '--accent': 'oklch(0.9 0.02 80)',
      '--border': 'oklch(0.88 0.01 80)',
      '--ring': 'oklch(0.62 0.14 75)',
    },
    dark: {
      '--background': 'oklch(0.11 0.012 80)',
      '--foreground': 'oklch(0.94 0.01 80)',
      '--card': 'oklch(0.15 0.012 80)',
      '--card-foreground': 'oklch(0.94 0.01 80)',
      '--primary': 'oklch(0.72 0.14 75)',
      '--primary-foreground': 'oklch(0.12 0.02 80)',
      '--secondary': 'oklch(0.18 0.012 80)',
      '--muted': 'oklch(0.18 0.012 80)',
      '--muted-foreground': 'oklch(0.62 0.02 80)',
      '--accent': 'oklch(0.2 0.015 80)',
      '--border': 'oklch(1 0 0 / 12%)',
      '--ring': 'oklch(0.72 0.14 75)',
    },
  },
  racing: {
    id: 'racing',
    swatch: { primary: '#E10600', background: '#0A0A0C' },
    light: {
      '--background': 'oklch(0.98 0.005 25)',
      '--foreground': 'oklch(0.12 0.02 25)',
      '--card': 'oklch(1 0 0)',
      '--card-foreground': 'oklch(0.12 0.02 25)',
      '--primary': 'oklch(0.52 0.26 25)',
      '--primary-foreground': 'oklch(0.99 0 0)',
      '--secondary': 'oklch(0.95 0.01 25)',
      '--muted': 'oklch(0.95 0.01 25)',
      '--muted-foreground': 'oklch(0.45 0.02 25)',
      '--accent': 'oklch(0.94 0.02 25)',
      '--border': 'oklch(0.9 0.01 25)',
      '--ring': 'oklch(0.52 0.26 25)',
    },
    dark: {
      '--background': 'oklch(0.08 0.01 25)',
      '--foreground': 'oklch(0.97 0.005 25)',
      '--card': 'oklch(0.12 0.012 25)',
      '--card-foreground': 'oklch(0.97 0.005 25)',
      '--primary': 'oklch(0.58 0.28 25)',
      '--primary-foreground': 'oklch(0.99 0 0)',
      '--secondary': 'oklch(0.16 0.012 25)',
      '--muted': 'oklch(0.16 0.012 25)',
      '--muted-foreground': 'oklch(0.6 0.02 25)',
      '--accent': 'oklch(0.18 0.015 25)',
      '--border': 'oklch(1 0 0 / 14%)',
      '--ring': 'oklch(0.58 0.28 25)',
    },
  },
}

const THEME_VAR_KEYS = Object.keys(colorThemes.classic.light)

export function applyColorTheme(themeId: string, isDark: boolean) {
  const theme = colorThemes[themeId as ColorThemeId] ?? colorThemes.classic
  const vars = isDark ? theme.dark : theme.light
  const root = document.documentElement

  for (const key of THEME_VAR_KEYS) {
    if (vars[key]) root.style.setProperty(key, vars[key])
  }
}

export function parseColorThemeId(value: string | undefined): ColorThemeId {
  if (value && value in colorThemes) return value as ColorThemeId
  return 'classic'
}
