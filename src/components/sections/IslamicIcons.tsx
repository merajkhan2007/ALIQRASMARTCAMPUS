// Reusable Islamic decorative SVG icons for the homepage
// All icons are inline SVGs for zero-dependency usage

export function CrescentStar({ className = "w-8 h-8", color = "currentColor" }: { className?: string; color?: string }) {
    return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Crescent Moon */}
            <path
                d="M32 8C32 8 20 16 20 32C20 48 32 56 32 56C24 52 16 44 16 32C16 20 24 12 32 8Z"
                fill={color}
                opacity="0.9"
            />
            {/* Star */}
            <path
                d="M44 18L45.5 22.5L50 24L45.5 25.5L44 30L42.5 25.5L38 24L42.5 22.5L44 18Z"
                fill={color}
                opacity="0.9"
            />
        </svg>
    );
}

export function Mosque({ className = "w-8 h-8", color = "currentColor" }: { className?: string; color?: string }) {
    return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Main dome */}
            <path d="M22 28C22 28 32 14 42 28" stroke={color} strokeWidth="2" fill="none" />
            <path d="M24 28H40V50H24V28Z" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
            {/* Minaret left */}
            <rect x="18" y="14" width="4" height="26" rx="1" fill={color} opacity="0.9" />
            <circle cx="20" cy="12" r="4" fill={color} opacity="0.9" />
            {/* Minaret right */}
            <rect x="42" y="20" width="3" height="20" rx="1" fill={color} opacity="0.9" />
            <circle cx="43.5" cy="18" r="3.5" fill={color} opacity="0.9" />
            {/* Door */}
            <path d="M29 50V40C29 38.8954 29.8954 38 31 38H33C34.1046 38 35 38.8954 35 40V50" fill={color} opacity="0.6" />
        </svg>
    );
}

export function IslamicStar({ className = "w-8 h-8", color = "currentColor" }: { className?: string; color?: string }) {
    return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 8-pointed Islamic star */}
            <path
                d="M32 4L36.5 14L32 24L27.5 14L32 4Z M32 40L36.5 50L32 60L27.5 50L32 40Z M4 32L14 27.5L24 32L14 36.5L4 32Z M40 32L50 27.5L60 32L50 36.5L40 32Z M12 12L18.5 15.5L12 22.5L5.5 18.5L12 12Z M52 12L58.5 15.5L52 22.5L45.5 18.5L52 12Z M12 41.5L18.5 45L12 52L5.5 48.5L12 41.5Z M52 41.5L58.5 45L52 52L45.5 48.5L52 41.5Z"
                fill={color}
                opacity="0.9"
            />
        </svg>
    );
}

export function Lantern({ className = "w-8 h-8", color = "currentColor" }: { className?: string; color?: string }) {
    return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Chain */}
            <line x1="32" y1="4" x2="32" y2="14" stroke={color} strokeWidth="2" />
            <circle cx="32" cy="4" r="3" fill={color} opacity="0.5" />
            {/* Top cap */}
            <path d="M20 14H44L38 18H26L20 14Z" fill={color} opacity="0.9" />
            {/* Body */}
            <path d="M24 18H40L44 46H20L24 18Z" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
            {/* Inner glow */}
            <ellipse cx="32" cy="32" rx="6" ry="10" fill={color} opacity="0.2" />
            {/* Bottom cap */}
            <path d="M20 46H44L38 50H26L20 46Z" fill={color} opacity="0.9" />
            {/* Tassel */}
            <line x1="32" y1="50" x2="32" y2="60" stroke={color} strokeWidth="1.5" />
            <circle cx="32" cy="62" r="3" fill={color} opacity="0.6" />
        </svg>
    );
}

export function Dome({ className = "w-8 h-8", color = "currentColor" }: { className?: string; color?: string }) {
    return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Dome body */}
            <path d="M12 44C12 44 12 16 32 6C52 16 52 44 52 44" stroke={color} strokeWidth="2" fill="none" />
            <path d="M12 44C12 44 12 16 32 6C52 16 52 44" fill={color} opacity="0.1" />
            {/* Base */}
            <line x1="8" y1="44" x2="56" y2="44" stroke={color} strokeWidth="2.5" />
            {/* Finial */}
            <line x1="32" y1="6" x2="32" y2="2" stroke={color} strokeWidth="1.5" />
            <circle cx="32" cy="2" r="3" fill={color} opacity="0.9" />
            {/* Crescent on finial */}
            <path d="M34 0C34 0 32 2 32 4C32 2 30 0 30 0" fill={color} opacity="0.8" />
        </svg>
    );
}

export function QuranBook({ className = "w-8 h-8", color = "currentColor" }: { className?: string; color?: string }) {
    return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Book cover */}
            <path d="M12 8H40L52 20V56H12V8Z" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
            {/* Spine */}
            <line x1="12" y1="8" x2="12" y2="56" stroke={color} strokeWidth="2.5" />
            {/* Cover fold */}
            <path d="M40 8V20H52" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Lines of text */}
            <line x1="18" y1="26" x2="30" y2="26" stroke={color} strokeWidth="1.5" opacity="0.6" />
            <line x1="18" y1="32" x2="35" y2="32" stroke={color} strokeWidth="1.5" opacity="0.6" />
            <line x1="18" y1="38" x2="28" y2="38" stroke={color} strokeWidth="1.5" opacity="0.6" />
            {/* Star decoration on cover */}
            <path d="M44 30L44.8 32.5L47.5 33.3L44.8 34.1L44 36.6L43.2 34.1L40.5 33.3L43.2 32.5L44 30Z" fill={color} opacity="0.7" />
        </svg>
    );
}

export function IslamicPattern({ className = "w-full h-full", color = "currentColor", opacity = 0.05 }: { className?: string; color?: string; opacity?: number }) {
    return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
            {/* Islamic geometric pattern - repeated hexagrams and stars */}
            <defs>
                <pattern id="islamic-geo" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    {/* 8-pointed star center */}
                    <path d="M30 6L33 15L30 24L27 15L30 6Z M30 36L33 45L30 54L27 45L30 36Z M6 30L15 27L24 30L15 33L6 30Z M36 30L45 27L54 30L45 33L36 30Z M13 13L17 16L13 21L9 18L13 13Z M47 13L51 16L47 21L43 18L47 13Z M13 39L17 42L13 47L9 44L13 39Z M47 39L51 42L47 47L43 44L47 39Z" fill={color} />
                    {/* Connecting lines */}
                    <line x1="12" y1="12" x2="5" y2="5" stroke={color} strokeWidth="0.5" />
                    <line x1="48" y1="12" x2="55" y2="5" stroke={color} strokeWidth="0.5" />
                    <line x1="12" y1="48" x2="5" y2="55" stroke={color} strokeWidth="0.5" />
                    <line x1="48" y1="48" x2="55" y2="55" stroke={color} strokeWidth="0.5" />
                    {/* Outer diamond */}
                    <rect x="28" y="28" width="4" height="4" fill={color} opacity="0.6" />
                </pattern>
            </defs>
            <rect width="200" height="200" fill="url(#islamic-geo)" />
        </svg>
    );
}

export function BismillahDecor({ className = "w-8 h-8", color = "currentColor" }: { className?: string; color?: string }) {
    return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Stylized Arabic calligraphy decorative arc */}
            <path
                d="M8 44C8 44 14 28 32 20C50 28 56 44 56 44"
                stroke={color}
                strokeWidth="2"
                fill="none"
                opacity="0.8"
            />
            <path
                d="M12 40C12 40 18 30 32 24C46 30 52 40 52 40"
                stroke={color}
                strokeWidth="1.2"
                fill="none"
                opacity="0.4"
            />
            {/* Decorative dots */}
            <circle cx="32" cy="16" r="3" fill={color} opacity="0.8" />
            <circle cx="22" cy="26" r="1.5" fill={color} opacity="0.5" />
            <circle cx="42" cy="26" r="1.5" fill={color} opacity="0.5" />
        </svg>
    );
}

export function Minaret({ className = "w-8 h-8", color = "currentColor" }: { className?: string; color?: string }) {
    return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Base */}
            <rect x="26" y="48" width="12" height="4" rx="1" fill={color} opacity="0.6" />
            {/* Tower */}
            <rect x="28" y="10" width="8" height="38" rx="1" fill={color} opacity="0.8" />
            {/* Balcony */}
            <rect x="24" y="32" width="16" height="4" rx="2" fill={color} opacity="0.7" />
            <rect x="24" y="24" width="16" height="4" rx="2" fill={color} opacity="0.7" />
            {/* Dome top */}
            <path d="M26 10C26 10 32 0 38 10" fill={color} opacity="0.9" />
            {/* Finial */}
            <line x1="32" y1="2" x2="32" y2="-2" stroke={color} strokeWidth="1.5" />
            <circle cx="32" cy="-2" r="2.5" fill={color} opacity="0.8" />
        </svg>
    );
}