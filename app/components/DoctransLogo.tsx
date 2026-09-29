'use client';

export default function DoctransLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dimensions = {
    sm: { icon: 32, text: 'text-lg' },
    md: { icon: 40, text: 'text-2xl' },
    lg: { icon: 56, text: 'text-3xl' },
  }[size];

  return (
    <div className="flex items-center gap-3">
      {/* Logo Icon */}
      <svg width={dimensions.icon} height={dimensions.icon} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background Shield */}
        <rect x="6" y="4" width="44" height="48" rx="10" fill="url(#logoGradient)" />
        
        {/* Document Shape */}
        <path d="M18 14H38V42H18V14Z" fill="white" fillOpacity="0.15" />
        <path d="M20 16H36V40H20V16Z" fill="white" fillOpacity="0.1" />
        
        {/* DT Monogram */}
        <path d="M24 36V20H28C30.5 20 32 21.8 32 25V31C32 34.2 30.5 36 28 36H24Z" fill="white" />
        <path d="M34 20H38L42 28L38 36H34L37 28L34 20Z" fill="white" />
        
        {/* Accent Line — represents translation flow */}
        <rect x="14" y="44" width="28" height="2" rx="1" fill="white" fillOpacity="0.6" />
        
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="logoGradient" x1="6" y1="4" x2="50" y2="52">
            <stop stopColor="#1E3A8A" />
            <stop offset="1" stopColor="#3730A3" />
          </linearGradient>
        </defs>
      </svg>

      {/* Brand Name */}
      <span className={`font-bold tracking-tight ${dimensions.text}`} style={{ color: '#1E293B' }}>
        <span style={{ color: '#1E3A8A' }}>Doc</span>trans
      </span>
    </div>
  );
}