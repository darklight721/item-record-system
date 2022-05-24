import { render, screen } from '@testing-library/react'
import Avatar from '.'

test('renders initials if image is empty', () => {
  render(<Avatar name="Roy" image="" />)

  expect(screen.getByText('R')).toBeInTheDocument()
})

test('renders image if given', () => {
  render(<Avatar name="Evan" image="https://placekitten.com/200/300" />)

  expect(screen.getByText('E')).toBeInTheDocument()
  expect(screen.getByRole('img')).toHaveAttribute(
    'src',
    'https://placekitten.com/200/300'
  )
})

test('renders placeholder if no name and image given', () => {
  render(<Avatar name="" image="" />)

  expect(screen.getByText('🆕')).toBeInTheDocument()
})
