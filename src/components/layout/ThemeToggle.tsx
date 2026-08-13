import { MonitorIcon, MoonIcon, SunIcon } from '@/components/ui/icons'
import { useCycleTheme, useThemeMode } from '@/stores/themeStore'
import type { ThemeMode } from '@/stores/themeStore'
import { cn } from '@/lib/utils/cn'

const LABELS: Record<ThemeMode, string> = {
  light: 'Light theme',
  dark: 'Dark theme',
  system: 'System theme',
}

const ICONS: Record<ThemeMode, typeof SunIcon> = {
  light: SunIcon,
  dark: MoonIcon,
  system: MonitorIcon,
}

export interface ThemeToggleProps {
  className?: string
}

/** Cycles light -> dark -> system. */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const mode = useThemeMode()
  const cycle = useCycleTheme()
  const Icon = ICONS[mode]

  return (
    <button
      type="button"
      onClick={cycle}
      title={`${LABELS[mode]} — click to change`}
      aria-label={`Change theme. Current: ${LABELS[mode]}`}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full',
        'text-white/85 transition-colors hover:bg-white/10 hover:text-white',
        className,
      )}
    >
      <Icon size={19} />
    </button>
  )
}
