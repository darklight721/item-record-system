import { type FieldHelperProps, type FieldInputProps, useField } from 'formik'
import Icon from '../Icon'

const DEFAULT_RENDER_INPUT = (
  props: FieldInputProps<any> & { id: string; className: string },
  helpers: FieldHelperProps<any>
) => <input type="text" {...props} />

type Props = {
  label: string
  name: string
  renderInput?: typeof DEFAULT_RENDER_INPUT
}

export default function Field({
  label,
  name,
  renderInput = DEFAULT_RENDER_INPUT
}: Props) {
  const [field, meta, helpers] = useField(name)
  const hasError = meta.touched && meta.error

  return (
    <div className="flex">
      <label
        className="block w-32 py-2 font-semibold text-gray-500"
        htmlFor={name}
      >
        {label}
      </label>
      <div className="flex-1">
        {renderInput(
          {
            ...field,
            id: name,
            className: `w-full py-2 px-3 bg-gray-100 rounded-md shadow-inner text-gray-900 ${
              hasError ? 'focus:outline-red-600' : 'focus:outline-teal-600'
            }`
          },
          helpers
        )}
        {hasError && (
          <div className="mt-1 flex items-start text-sm text-red-500">
            <Icon className="mr-1 flex-shrink-0" name="exclamation" />
            {meta.error}
          </div>
        )}
      </div>
    </div>
  )
}
