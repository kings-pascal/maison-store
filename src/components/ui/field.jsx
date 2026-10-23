const baseClass =
  'w-full rounded-lg border bg-neutral-950 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-white/70'

const fieldClass = (error) => `${baseClass} ${error ? 'border-red-500' : 'border-neutral-700'}`

function FieldShell({ id, label, error, className, children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm text-neutral-300">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

export function TextField({ id, label, error, className = '', ...inputProps }) {
  return (
    <FieldShell id={id} label={label} error={error} className={className}>
      <input
        id={id}
        name={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={fieldClass(error)}
        {...inputProps}
      />
    </FieldShell>
  )
}

export function SelectField({
  id,
  label,
  error,
  options,
  placeholder,
  className = '',
  ...selectProps
}) {
  return (
    <FieldShell id={id} label={label} error={error} className={className}>
      <select
        id={id}
        name={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={fieldClass(error)}
        {...selectProps}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}