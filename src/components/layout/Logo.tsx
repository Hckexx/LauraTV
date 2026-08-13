interface LogoProps {
  className?: string
}

function Logo({ className = "w-10 h-10" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Laura TV"
      role="img"
    >
      <defs>
        {/* Premium metallic-red gradient */}
        <linearGradient
          id="lauraLogoMain"
          x1="12"
          y1="8"
          x2="38"
          y2="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#FF5A5F" />
          <stop offset="0.28" stopColor="#F43F46" />
          <stop offset="0.65" stopColor="#C91F2A" />
          <stop offset="1" stopColor="#8F1019" />
        </linearGradient>

        {/* Subtle highlight */}
        <linearGradient
          id="lauraLogoHighlight"
          x1="18"
          y1="8"
          x2="27"
          y2="38"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="0.45" stopColor="#FFFFFF" stopOpacity="0.18" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Deep inner shadow */}
        <linearGradient
          id="lauraLogoShadow"
          x1="30"
          y1="17"
          x2="35"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#5C0710" stopOpacity="0" />
          <stop offset="1" stopColor="#5C0710" stopOpacity="0.55" />
        </linearGradient>

        {/* Very subtle glow */}
        <filter
          id="lauraLogoGlow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="
              1 0 0 0 0.75
              0 0 0 0 0.05
              0 0 0 0 0.08
              0 0 0 0.45 0
            "
          />
          <feBlend
            in="SourceGraphic"
            mode="normal"
          />
        </filter>
      </defs>

      {/* Soft ambient glow */}
      <path
        d="M14.2 8.5H18.5C19.33 8.5 20 9.17 20 10V34.8H34.2C35.03 34.8 35.7 35.47 35.7 36.3V39.2C35.7 40.03 35.03 40.7 34.2 40.7H14.2C13.37 40.7 12.7 40.03 12.7 39.2V10C12.7 9.17 13.37 8.5 14.2 8.5Z"
        fill="#E32636"
        opacity="0.2"
        filter="url(#lauraLogoGlow)"
      />

      {/* Main L silhouette */}
      <path
        d="
          M14.2 8.5
          H18.5
          C19.33 8.5 20 9.17 20 10
          V34.8
          H34.2
          C35.03 34.8 35.7 35.47 35.7 36.3
          V39.2
          C35.7 40.03 35.03 40.7 34.2 40.7
          H14.2
          C13.37 40.7 12.7 40.03 12.7 39.2
          V10
          C12.7 9.17 13.37 8.5 14.2 8.5
          Z
        "
        fill="url(#lauraLogoMain)"
      />

      {/* Inner dimensional shadow */}
      <path
        d="
          M20 10
          V34.8
          H34.2
          C35.03 34.8 35.7 35.47 35.7 36.3
          V39.2
          C35.7 40.03 35.03 40.7 34.2 40.7
          H30.5
          V37.5
          C30.5 36.67 29.83 36 29 36
          H20
          V10
          Z
        "
        fill="url(#lauraLogoShadow)"
      />

      {/* L highlight edge */}
      <path
        d="
          M14.2 10
          C14.2 9.17 14.87 8.5 15.7 8.5
          H18.5
          C19.33 8.5 20 9.17 20 10
          V34.8
        "
        stroke="url(#lauraLogoHighlight)"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.65"
      />

      {/* Premium play cut */}
      <path
        d="
          M27.1 18.2
          L34.9 24
          C35.55 24.48 35.55 25.52 34.9 26
          L27.1 31.8
          C26.31 32.39 25.2 31.82 25.2 30.84
          V19.16
          C25.2 18.18 26.31 17.61 27.1 18.2
          Z
        "
        fill="#FFFFFF"
        fillOpacity="0.96"
      />

      {/* Play shadow for depth */}
      <path
        d="
          M34.9 24
          C35.55 24.48 35.55 25.52 34.9 26
          L27.1 31.8
          C26.31 32.39 25.2 31.82 25.2 30.84
          V28.8
          L32.1 23.7
          C32.85 23.15 33.8 23.2 34.9 24
          Z
        "
        fill="#A30F1A"
        fillOpacity="0.25"
      />

      {/* Tiny highlight on play triangle */}
      <path
        d="M27 19.4L33.9 24.5"
        stroke="#FFFFFF"
        strokeOpacity="0.55"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default Logo