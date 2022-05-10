import { Formik, Form, Field } from 'formik'
import DatePicker from 'react-datepicker'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ItemSchema, type Item } from '../store'
import 'react-datepicker/dist/react-datepicker.css'

export const DATE_FORMAT = 'MM-dd-yyyy'

type Props = {
  readonly?: boolean
  getItem?: (id: string) => Item | undefined
  saveItem?: (item: Item) => void
  removeItem?: (item: Item) => void
}

export default function ItemComponent({
  readonly = false,
  getItem,
  saveItem,
  removeItem
}: Props) {
  const { itemId } = useParams()
  const navigate = useNavigate()
  const item = itemId ? getItem?.(itemId) : undefined

  if (itemId && !item) return <div>Not found :(</div>

  return (
    <Formik
      enableReinitialize
      initialValues={item ?? ItemSchema.cast({})}
      validationSchema={ItemSchema}
      onSubmit={values => {
        saveItem?.(values)
        navigate(`/${values.id}`)
      }}
    >
      {({ values, dirty, isValid, setFieldValue, setFieldTouched }) => (
        <Form className="h-full overflow-y-auto p-3">
          <label>Name</label>
          <Field name="name" />
          <label>Description</label>
          <Field name="description" as="textarea" />
          <label>Image</label>
          <Field name="image" type="url" />
          {values.image && <img src={values.image} alt={values.name} />}
          <label>Date</label>
          <DatePicker
            dateFormat={DATE_FORMAT}
            selected={values.date}
            onChange={(date: Date) => setFieldValue('date', date)}
            onBlur={() => setFieldTouched('date')}
          />
          {readonly && item ? (
            <>
              <Link to="edit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure?')) {
                    removeItem?.(item)
                    navigate('/')
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Remove
              </button>
            </>
          ) : (
            <>
              <button disabled={dirty && !isValid} type="submit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                </svg>
                Save
              </button>
              {item && (
                <Link to={`/${item.id}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Cancel
                </Link>
              )}
            </>
          )}
        </Form>
      )}
    </Formik>
  )
}
