import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export function Logo({ size = 'sm', showText = true }: LogoProps) {
  const sizes = {
    sm: { width: 50, height: 50, textSize: 'text-xl' },
    md: { width: 80, height: 80, textSize: 'text-2xl' },
    lg: { width: 120, height: 120, textSize: 'text-3xl md:text-4xl' }
  }

  const { width, height, textSize } = sizes[size]

  return (
    <div className="flex items-center gap-4">
      <Image
        src="/logo-musicoterapia.png"
        alt="Logo Musicoterapia"
        width={width}
        height={height}
        className="rounded-full logo-musicoterapia"
        priority
      />
      {showText && (
        <span className={`font-bold text-green-700 ${textSize}`}>
          Musicoterapia
        </span>
      )}
    </div>
  )
}
