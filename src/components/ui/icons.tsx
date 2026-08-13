import type { SVGProps } from 'react'

/**
 * Inline icon set.
 *
 * Replaces react-icons, which shipped its whole icon manifest into the bundle.
 * Each icon is a plain component inheriting `currentColor` and sizing from the
 * `size` prop, so they theme automatically.
 */

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  size?: number | string
}

function Icon({ size = 20, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const SearchIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
)

export const MenuIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Icon>
)

export const CloseIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
)

export const ChevronLeftIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m15 5-7 7 7 7" />
  </Icon>
)

export const ChevronRightIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m9 5 7 7-7 7" />
  </Icon>
)

export const ChevronDownIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m5 9 7 7 7-7" />
  </Icon>
)

export const HeartIcon = ({ filled = false, ...props }: IconProps & { filled?: boolean }) => (
  <Icon fill={filled ? 'currentColor' : 'none'} {...props}>
    <path d="M12 20.5 4.6 13.1a4.7 4.7 0 0 1 6.6-6.7l.8.8.8-.8a4.7 4.7 0 0 1 6.6 6.7Z" />
  </Icon>
)

export const BookmarkIcon = ({ filled = false, ...props }: IconProps & { filled?: boolean }) => (
  <Icon fill={filled ? 'currentColor' : 'none'} {...props}>
    <path d="M6 4h12v17l-6-4.5L6 21Z" />
  </Icon>
)

export const PlayIcon = ({ filled = true, ...props }: IconProps & { filled?: boolean }) => (
  <Icon fill={filled ? 'currentColor' : 'none'} {...props}>
    <path d="M8 5.5v13l11-6.5Z" />
  </Icon>
)

export const StarIcon = ({ filled = false, ...props }: IconProps & { filled?: boolean }) => (
  <Icon fill={filled ? 'currentColor' : 'none'} {...props}>
    <path d="m12 3.5 2.6 5.6 6.1.8-4.5 4.2 1.1 6-5.3-3-5.3 3 1.1-6L3.3 9.9l6.1-.8Z" />
  </Icon>
)

export const SunIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
  </Icon>
)

export const MoonIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
  </Icon>
)

export const MonitorIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="2.5" y="4" width="19" height="13" rx="2" />
    <path d="M8.5 21h7M12 17v4" />
  </Icon>
)

export const FilmIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="2.5" y="4" width="19" height="16" rx="2" />
    <path d="M7 4v16M17 4v16M2.5 12h19M2.5 8h4.5M2.5 16h4.5M17 8h4.5M17 16h4.5" />
  </Icon>
)

export const TvIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="2.5" y="6.5" width="19" height="13" rx="2" />
    <path d="m8 2.5 4 4 4-4" />
  </Icon>
)

export const UsersIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <path d="M16.5 5.2a3.5 3.5 0 0 1 0 5.6M18 20a6.4 6.4 0 0 0-1.8-4.5" />
  </Icon>
)

export const AlertIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5M12 16.5h.01" />
  </Icon>
)

export const ImageIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3" y="4.5" width="18" height="15" rx="2" />
    <circle cx="8.5" cy="10" r="1.8" />
    <path d="m3.5 17.5 5-4.5 4.5 4 3-2.5 4.5 4" />
  </Icon>
)

export const UserIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="8.5" r="3.8" />
    <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
  </Icon>
)

export const ExternalLinkIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M14 4h6v6M20 4l-8.5 8.5" />
    <path d="M18 14v5a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 19V7.5A1.5 1.5 0 0 1 5.5 6H10" />
  </Icon>
)

export const FilterIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3.5 6h17M6.5 12h11M10 18h4" />
  </Icon>
)

export const TrashIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 7h16M9.5 7V4.5h5V7M6 7l1 13h10l1-13" />
  </Icon>
)
