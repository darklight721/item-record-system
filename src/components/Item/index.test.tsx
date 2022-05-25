import { render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Item from '.'

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

  expect(screen.getByText('Not found :(')).toBeInTheDocument()
})

test.todo('renders new item')

test.todo('renders existing item')
