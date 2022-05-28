import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '.'

test('renders app', async () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  )

  expect(screen.queryByRole('listitem')).not.toBeInTheDocument()

  userEvent.type(screen.getByLabelText('Name'), 'First Item')
  userEvent.click(screen.getByRole('button', { name: 'Save' }))
  expect(
    await screen.findByRole('listitem', { name: 'First Item' })
  ).toBeInTheDocument()

  userEvent.click(screen.getByRole('link', { name: 'Item' }))
  userEvent.type(screen.getByLabelText('Name'), 'Second Item')
  userEvent.click(screen.getByRole('button', { name: 'Save' }))
  expect(
    await screen.findByRole('listitem', { name: 'Second Item' })
  ).toBeInTheDocument()

  userEvent.click(screen.getByRole('link', { name: 'Item' }))
  userEvent.type(screen.getByLabelText('Name'), 'Third Item')
  userEvent.click(screen.getByRole('button', { name: 'Save' }))
  expect(
    await screen.findByRole('listitem', { name: 'Third Item' })
  ).toBeInTheDocument()

  jest.spyOn(window, 'confirm').mockReturnValueOnce(true)
  userEvent.click(screen.getByRole('button', { name: 'Remove' }))
  await waitFor(() =>
    expect(screen.getByLabelText('Name')).toHaveValue('Second Item')
  )

  userEvent.click(
    within(screen.getByRole('listitem', { name: 'First Item' })).getByRole(
      'link'
    )
  )
  await waitFor(() =>
    expect(screen.getByLabelText('Name')).toHaveValue('First Item')
  )

  userEvent.click(screen.getByRole('link', { name: 'Item Record System' }))
  await waitFor(() =>
    expect(screen.getByLabelText('Name')).toHaveValue('Second Item')
  )
})
