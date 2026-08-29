import type { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

function Icon({ children, size = 18, className = '', ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
}

export const IconSun = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></Icon>;
export const IconMoon = (p: IconProps) => <Icon {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></Icon>;
export const IconMenu = (p: IconProps) => <Icon {...p}><path d="M4 6h16M4 12h16M4 18h16" /></Icon>;
export const IconX = (p: IconProps) => <Icon {...p}><path d="M18 6 6 18M6 6l12 12" /></Icon>;
export const IconChevronRight = (p: IconProps) => <Icon {...p}><path d="m9 18 6-6-6-6" /></Icon>;
export const IconMapPin = (p: IconProps) => <Icon {...p}><path d="M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" /><circle cx="12" cy="10" r="2.5" /></Icon>;
export const IconCheck = (p: IconProps) => <Icon {...p}><path d="M20 6 9 17l-5-5" /></Icon>;
export const IconCheckCircle = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="m9 12 2 2 4-4" /></Icon>;
export const IconClock = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon>;
export const IconCamera = (p: IconProps) => <Icon {...p}><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" /><circle cx="12" cy="13" r="3.2" /></Icon>;
export const IconUpload = (p: IconProps) => <Icon {...p}><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 20h16" /></Icon>;
export const IconUser = (p: IconProps) => <Icon {...p}><circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" /></Icon>;
export const IconLayout = (p: IconProps) => <Icon {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></Icon>;
export const IconList = (p: IconProps) => <Icon {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></Icon>;
export const IconPlus = (p: IconProps) => <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>;
export const IconLogOut = (p: IconProps) => <Icon {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></Icon>;
export const IconHelp = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1.3 1-1.3 2M12 17h.01" /></Icon>;
export const IconStar = (p: IconProps) => <Icon {...p}><path d="m12 3 2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 17l-5.6 3.1 1.4-6.3L3 9.5l6.4-.6Z" /></Icon>;
export const IconShield = (p: IconProps) => <Icon {...p}><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6Z" /></Icon>;
export const IconBuilding = (p: IconProps) => <Icon {...p}><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M9 21v-4h6v4M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1" /></Icon>;
export const IconUsers = (p: IconProps) => <Icon {...p}><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c1.2-3.4 4-5 6.5-5s5.3 1.6 6.5 5" /><circle cx="18" cy="9" r="2.6" /><path d="M16 14.2c2.1.4 3.7 1.7 4.5 3.8" /></Icon>;
export const IconTriangleAlert = (p: IconProps) => <Icon {...p}><path d="M10.3 3.9 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></Icon>;
export const IconArrowLeft = (p: IconProps) => <Icon {...p}><path d="M19 12H5M12 19l-7-7 7-7" /></Icon>;
export const IconPlay = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="10" /><path d="M10 8.5v7l6-3.5-6-3.5Z" fill="currentColor" stroke="none" /></Icon>;
export const IconFile = (p: IconProps) => <Icon {...p}><path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8Z" /><path d="M14 3v5h5" /></Icon>;
export const IconTrash = (p: IconProps) => <Icon {...p}><path d="M4 7h16M8 7V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13" /></Icon>;
export const IconBell = (p: IconProps) => <Icon {...p}><path d="M6 9a6 6 0 1 1 12 0c0 4.2 1 6 2 7H4c1-1 2-2.8 2-7Z" /><path d="M9.5 19a2.5 2.5 0 0 0 5 0" /></Icon>;
