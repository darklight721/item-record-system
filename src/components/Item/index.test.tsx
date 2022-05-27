import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ItemSchema } from '../../store'
import Item from '.'

const TIME = 1653579770194 // 2022-05-26
jest.useFakeTimers().setSystemTime(TIME)

function renderView(path: string, props: ComponentProps<typeof Item>) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path=":itemId" element={<Item {...props} />} />
        <Route path="new" element={<Item {...props} />} />
        <Route path="*" element={null} />
      </Routes>
    </MemoryRouter>
  )
}

test('shows message when item not found', () => {
  renderView('/1', { getItem: id => undefined })

  expect(screen.queryByRole('form')).not.toBeInTheDocument()
  expect(screen.getByText('Not found :(')).toBeInTheDocument()
})

test('renders new item', async () => {
  const saveItemMock = jest.fn()
  renderView('/new', { saveItem: saveItemMock })

  const saveButton = screen.getByRole('button', { name: 'Save' })
  const resetButton = screen.getByRole('button', { name: 'Reset' })

  expect(saveButton).toBeDisabled()
  expect(resetButton).toBeDisabled()
  expect(
    screen.queryByRole('button', { name: 'Remove' })
  ).not.toBeInTheDocument()

  userEvent.type(screen.getByLabelText('Name'), 'Item 1')
  expect(saveButton).toBeEnabled()
  expect(resetButton).toBeEnabled()

  userEvent.click(resetButton)
  expect(saveButton).toBeDisabled()
  expect(resetButton).toBeDisabled()

  userEvent.type(screen.getByLabelText('Name'), 'New item')
  userEvent.click(saveButton)

  await waitFor(() =>
    expect(saveItemMock).toHaveBeenCalledWith({
      id: TIME.toString(),
      name: 'New item',
      date: new Date(TIME),
      description: '',
      image: ''
    })
  )
})

test('renders existing item', async () => {
  const saveItemMock = jest.fn()
  const removeItemMock = jest.fn()

  renderView('/1', {
    getItem: id =>
      ItemSchema.cast({
        id: '1',
        name: 'Item 2',
        description: 'Some description',
        image: 'https://placekitten.com/200/300'
      }),
    saveItem: saveItemMock,
    removeItem: removeItemMock
  })

  const saveButton = screen.getByRole('button', { name: 'Save' })
  const removeButton = screen.getByRole('button', { name: 'Remove' })

  expect(removeButton).toBeInTheDocument()

  userEvent.clear(screen.getByLabelText('Name'))
  userEvent.clear(screen.getByLabelText('Image'))
  userEvent.type(screen.getByLabelText('Image'), 'invalid url')
  userEvent.type(screen.getByLabelText('Description'), '..')
  userEvent.click(screen.getByLabelText('Date'))
  userEvent.click(
    screen.getByRole('option', { name: 'Choose Friday, May 27th, 2022' })
  )

  expect(await screen.findAllByRole('alert')).toHaveLength(2)
  expect(saveButton).toBeDisabled()

  userEvent.type(screen.getByLabelText('Name'), 'Old item')
  userEvent.clear(screen.getByLabelText('Image'))
  await waitFor(() =>
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  )

  userEvent.click(saveButton)
  await waitFor(() =>
    expect(saveItemMock).toHaveBeenCalledWith({
      id: '1',
      name: 'Old item',
      date: new Date('2022-05-27T15:42:50.000Z'),
      description: 'Some description..',
      image: ''
    })
  )

  jest.spyOn(window, 'confirm').mockReturnValueOnce(true)
  userEvent.click(removeButton)
  await waitFor(() => expect(removeItemMock).toHaveBeenCalledWith('1'))
})
