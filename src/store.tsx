import * as Yup from 'yup'

export const ItemSchema = Yup.object().shape({
  id: Yup.string()
    .required()
    .default(() => Date.now().toString()),
  name: Yup.string().required().default(''),
  description: Yup.string().default(''),
  image: Yup.string().url().default(''),
  date: Yup.date()
    .required()
    .default(() => new Date())
})

export type Item = Yup.InferType<typeof ItemSchema>

const STORE_KEY = 'items'

export function getItems() {
  const rawItems = localStorage.getItem(STORE_KEY)
  return rawItems
    ? (JSON.parse(rawItems) as Item[]).map(i => ItemSchema.cast(i))
    : []
}

export function saveItems(items: Item[]) {
  localStorage.setItem(STORE_KEY, JSON.stringify(items))
}
