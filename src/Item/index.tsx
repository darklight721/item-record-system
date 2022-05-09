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
        <Form>
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
              <Link to="edit">Edit</Link>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure?')) {
                    removeItem?.(item)
                    navigate('/')
                  }
                }}
              >
                Remove
              </button>
            </>
          ) : (
            <>
              <button disabled={dirty && !isValid} type="submit">
                Save
              </button>
              {item && <Link to={`/${item.id}`}>Cancel</Link>}
            </>
          )}
        </Form>
      )}
    </Formik>
  )
}
