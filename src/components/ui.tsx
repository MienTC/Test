import { forwardRef, type ReactNode } from 'react'
import UWrapperInput from './shared/uwrapper-input'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  required?: boolean
  error?: string
}

export const TextInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, required, error, className = '', ...rest }, ref) => {
    return (
      <UWrapperInput
        label={label}
        required={required}
        error={error}
        htmlFor={typeof rest.id === 'string' ? rest.id : undefined}
      >
        <input
          ref={ref}
          className={`w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 ${className}`}
          {...rest}
        />
      </UWrapperInput>
    )
  },
)

TextInput.displayName = 'TextInput'

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  required?: boolean
  error?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, required, error, className = '', ...rest }, ref) => {
    return (
      <UWrapperInput
        label={label}
        required={required}
        error={error}
        htmlFor={typeof rest.id === 'string' ? rest.id : undefined}
      >
        <textarea
          ref={ref}
          className={`min-h-[80px] w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 ${className}`}
          {...rest}
        />
      </UWrapperInput>
    )
  },
)

TextArea.displayName = 'TextArea'

type ButtonVariant = 'primary' | 'ghost' | 'danger'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  children: ReactNode
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed'

  const variants: Record<ButtonVariant, string> = {
    primary: disabled
      ? 'border border-slate-300 bg-slate-100 text-slate-500 shadow-none'
      : 'border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 shadow-sm focus-visible:ring-blue-500',
    ghost: disabled
      ? 'border border-slate-200 bg-slate-50 text-slate-400 shadow-none'
      : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-sm',
    danger: disabled
      ? 'border border-red-100 bg-red-50 text-red-300 shadow-none'
      : 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 focus-visible:ring-red-500',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}

type BadgeTone = 'default' | 'danger'

type BadgeProps = {
  children: ReactNode
  tone?: BadgeTone
}

export function Badge({ children, tone = 'default' }: BadgeProps) {
  const base =
    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium'
  const tones: Record<BadgeTone, string> = {
    default: 'bg-slate-100 text-slate-700',
    danger: 'bg-red-50 text-red-700',
  }

  return <span className={`${base} ${tones[tone]}`}>{children}</span>
}

