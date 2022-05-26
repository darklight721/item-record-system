import { Formik, Form } from 'formik'
import DatePicker from 'react-datepicker'
import { useNavigate, useParams } from 'react-router-dom'
import { ItemSchema, type Item } from '../../store'
import Icon from '../Icon'
import Field from '../Field'
import Avatar from '../Avatar'
import 'react-datepicker/dist/react-datepicker.css'

export const DATE_FORMAT = 'MM-dd-yyyy'

export const BUTTON_BASE_STYLE =
  'flex items-center rounded-md px-4 py-3 text-sm font-semibold uppercase tracking-wider disabled:pointer-events-none disabled:opacity-60'

type Props = {
  getItem?: (id: string) => Item | undefined
  saveItem?: (item: Item) => void
  removeItem?: (item: Item) => void
}

export default function ItemComponent({
  getItem,
  saveItem,
  removeItem
}: Props) {
  const { itemId } = useParams()
  const navigate = useNavigate()
  const item = itemId ? getItem?.(itemId) : undefined

  if (itemId && !item)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-4 text-lg">
        <Icon name="exclamation" />
        <p>Not found :(</p>
      </div>
    )

  return (
    <Formik
      enableReinitialize
      initialValues={item ?? ItemSchema.cast({})}
      validationSchema={ItemSchema}
      onSubmit={values => {
        saveItem?.(values)
        if (!item) navigate(`/${values.id}`)
      }}
    >
      {({ values, dirty, isValid }) => (
        <Form className="flex h-full flex-col" name="Item">
          <div className="flex-1 overflow-y-auto">
            <Avatar
              className="h-48 w-full text-2xl"
              name={values.name}
              image={values.image}
            />
            <div className="space-y-3 p-4">
              <Field name="name" label="Name" />
              <Field
                name="date"
                label="Date"
                renderInput={(props, helpers) => (
                  <DatePicker
                    id={props.id}
                    className={props.className}
                    name={props.name}
                    dateFormat={DATE_FORMAT}
                    selected={props.value}
                    onChange={(date: Date) => helpers.setValue(date)}
                    onBlur={() => helpers.setTouched(true)}
                  />
                )}
              />
              <Field
                name="description"
                label="Description"
                renderInput={({ className, ...props }) => (
                  <textarea {...props} className={`${className} h-full`} />
                )}
              />
              <Field
                name="image"
                label="Image"
                renderInput={props => <input {...props} type="url" />}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 border-t border-gray-200 bg-gray-100 p-4">
            {item && (
              <button
                className={`${BUTTON_BASE_STYLE} mr-auto bg-transparent text-red-700 hover:bg-red-700 hover:text-white active:bg-red-800 active:text-white`}
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure?')) {
                    removeItem?.(item)
                    navigate('/')
                  }
                }}
              >
                <Icon className="mr-2 h-4 w-4" name="trash" />
                Remove
              </button>
            )}
            <button
              className={`${BUTTON_BASE_STYLE} bg-transparent text-teal-900 hover:bg-teal-800 hover:text-white active:bg-teal-900 active:text-white`}
              disabled={!dirty}
              type="reset"
            >
              <Icon className="mr-2 h-4 w-4" name="refresh" />
              Reset
            </button>
            <button
              className={`${BUTTON_BASE_STYLE} bg-teal-700 text-white hover:bg-teal-800 active:bg-teal-900`}
              disabled={!dirty || !isValid}
              type="submit"
            >
              <Icon className="mr-2 h-4 w-4" name="save" />
              Save
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
