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
        <Form>
          <div className="space-y-2 p-3">
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
            {(values.name || values.image) && (
              <Avatar
                className="h-52 w-full rounded-lg text-2xl"
                imgClassName="object-contain"
                name={values.name}
                image={values.image}
              />
            )}
          </div>
          <div className="sticky bottom-0 flex justify-end space-x-2 border-t border-t-gray-100 bg-white p-3">
            <button
              className="flex items-center rounded-md border-2 border-blue-500 px-3 py-2 hover:border-blue-500 hover:bg-blue-500 hover:text-white active:border-blue-600 active:bg-blue-600"
              disabled={!dirty || !isValid}
              type="submit"
            >
              <Icon className="mr-1" name="save" />
              Save
            </button>
            <button
              className="flex items-center rounded-md border-2 border-blue-500 px-3 py-2 hover:border-blue-500 hover:bg-blue-500 hover:text-white active:border-blue-600 active:bg-blue-600"
              disabled={!dirty}
              type="reset"
            >
              <Icon className="mr-1" name="refresh" />
              Reset
            </button>
            {item && (
              <button
                className="flex items-center rounded-md border-2 border-blue-500 px-3 py-2 hover:border-blue-500 hover:bg-blue-500 hover:text-white active:border-blue-600 active:bg-blue-600"
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure?')) {
                    removeItem?.(item)
                    navigate('/')
                  }
                }}
              >
                <Icon className="mr-1" name="trash" />
                Remove
              </button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  )
}
