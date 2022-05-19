import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import List from '.'
import { ItemSchema } from '../../store'

test('renders list', () => {
  const items = [
    { id: '1', name: 'Not item 1', date: new Date(2022, 1, 12) },
    { id: '2', name: 'Item 2', date: new Date(2022, 2, 12) }
  ].map(i => ItemSchema.cast(i))

  render(
    <MemoryRouter>
      <List items={items} />
    </MemoryRouter>
  )

  let list = screen.getAllByRole('listitem')
  expect(list).toHaveLength(2)

  expect(list[0]).toHaveTextContent('IItem 203-12-2022')
  expect(list[1]).toHaveTextContent('NNot item 102-12-2022')

  fireEvent.change(screen.getByPlaceholderText('Search items'), {
    target: { value: '1' }
  })

  list = screen.getAllByRole('listitem')
  expect(list).toHaveLength(1)
  expect(list[0]).toHaveTextContent('NNot item 102-12-2022')
})
