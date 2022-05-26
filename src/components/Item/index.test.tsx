import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Item from '.'

const TIME = 1653579770194 // 2022-05-26
jest.useFakeTimers().setSystemTime(TIME)

function renderView(path: string, props: ComponentProps<typeof Item>) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path=":itemId" element={<Item {...props} />} />
        <Route path="new" element={<Item {...props} />} />
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

  expect(screen.getByRole('form')).toHaveFormValues({
    name: '',
    date: '05-26-2022',
    description: '',
    image: ''
  })
  expect(saveButton).toBeDisabled()
  expect(resetButton).toBeDisabled()
  expect(
    screen.queryByRole('button', { name: 'Remove' })
  ).not.toBeInTheDocument()

  userEvent.type(screen.getByLabelText('Name'), 'Item 1')
  expect(saveButton).toBeEnabled()
  expect(resetButton).toBeEnabled()

  userEvent.click(resetButton)
  expect(screen.getByRole('form')).toHaveFormValues({
    name: '',
    date: '05-26-2022',
    description: '',
    image: ''
  })
  expect(saveButton).toBeDisabled()
  expect(resetButton).toBeDisabled()

  userEvent.type(screen.getByLabelText('Name'), 'Item 1')
  userEvent.click(saveButton)

  await waitFor(() =>
    expect(saveItemMock).toHaveBeenCalledWith({
      id: TIME.toString(),
      name: 'Item 1',
      date: new Date(TIME),
      description: '',
      image: ''
    })
  )
})

test.todo('renders existing item')
