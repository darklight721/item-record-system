import { Formik, Form } from 'formik'
import DatePicker from 'react-datepicker'
import { useNavigate, useParams } from 'react-router-dom'
import { ItemSchema, type Item } from '../store'
import Icon from '../Icon'
import Field from '../Field'
import Avatar from '../Avatar'
import 'react-datepicker/dist/react-datepicker.css'

export const DATE_FORMAT = 'MM-dd-yyyy'

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
      <div className="flex h-full w-full flex-col items-center justify-center p-3 text-lg">
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
        <Form className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto">
            <Avatar
              className="h-48 w-full text-2xl"
              name={values.name}
              image={values.image}
            />
            <div className="space-y-2 p-4">
              <Field name="name" label="Name" />
              <Field
                name="date"
                label="Date"
                renderInput={(props, helpers) => (
                  <DatePicker
                    id={props.id}
                    className={props.className}
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
          <div className="flex justify-end space-x-2 border-t border-t-gray-100 bg-gray-100 p-4">
            {item && (
              <button
                className="flex items-center rounded-md bg-transparent px-4 py-2 text-sm font-semibold uppercase tracking-wider text-teal-900"
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
              className="flex items-center rounded-md bg-transparent px-4 py-2 text-sm font-semibold uppercase tracking-wider text-teal-900"
              disabled={!dirty}
              type="reset"
            >
              <Icon className="mr-2 h-4 w-4" name="refresh" />
              Reset
            </button>
            <button
              className="flex items-center rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white"
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
