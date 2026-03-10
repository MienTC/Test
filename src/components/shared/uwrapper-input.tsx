import type { ReactNode } from 'react'

type UWrapperInputProps = {
  label?: string
  error?: string
  required?: boolean
  children: ReactNode
  htmlFor?: string
  vertical?: boolean
  className?: string
}

export default function UWrapperInput({
  label,
  error,
  children,
  required,
  htmlFor,
  vertical = true,
  className = '',
}: UWrapperInputProps) {
  const directionClass = vertical ? 'flex-col items-stretch' : 'items-center'

  return (
    <div className={`flex gap-1 ${directionClass} ${className}`}>
      {label && (
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex min-w-0 items-baseline gap-2">
            <label
              htmlFor={htmlFor}
              className="flex-none text-sm font-medium text-slate-700"
            >
              {label}
              {required && (
                <span className="ml-0.5 text-xs text-rose-500">*</span>
              )}
            </label>
            {error && (
              <p
                className="line-clamp-1 flex-1 text-xs text-rose-500"
                title={error}
              >
                {error}
              </p>
            )}
          </div>
          <div className="w-full">{children}</div>
        </div>
      )}
      {!label && <div className="w-full">{children}</div>}
    </div>
  )
}