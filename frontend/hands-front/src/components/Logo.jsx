export default function Logo({ height = 48, light = false }) {
  const markColor = light ? '#FFFFFF' : '#5B2EFF'
  const textColor = light ? '#FFFFFF' : '#1F2937'

  return (
    <div className="flex items-center gap-2">
      <svg width={height * 0.62} height={height * 0.62} viewBox="0 0 200 200" fill="none">
        <path
          d="M100 10C85 10 73 22 73 37C73 55 100 78 100 78C100 78 127 55 127 37C127 22 115 10 100 10Z"
          fill="#FFC857"
        />
        <circle cx="100" cy="37" r="12" fill="white" />
        <rect x="18" y="85" width="34" height="90" rx="17" fill={markColor} />
        <rect x="148" y="85" width="34" height="90" rx="17" fill={markColor} />
        <rect x="35" y="110" width="130" height="38" rx="19" fill={markColor} />
        <circle cx="100" cy="129" r="13" fill={markColor} />
      </svg>
      <div>
        <div
          className="font-black leading-tight"
          style={{ fontFamily: 'Outfit, sans-serif', fontSize: height * 0.4, color: textColor }}
        >
          Hands
        </div>
        <div
          className="font-semibold leading-none tracking-wide"
          style={{ fontFamily: 'Outfit, sans-serif', fontSize: height * 0.17, color: '#FFC857' }}
        >
          ENCONTRE QUEM RESOLVE.
        </div>
      </div>
    </div>
  )
}
