import { useMemo, useState } from 'react'
import { Link, Navigate, NavLink, useMatch } from 'react-router-dom'
import sortBy from 'lodash.sortby'
import { format } from 'date-fns'
import type { Item } from '../store'
import { DATE_FORMAT, BUTTON_BASE_STYLE } from '../Item'
import Icon from '../Icon'
import Avatar from '../Avatar'

type Props = {
  items: Item[]
}

export default function List({ items }: Props) {
  const [filter, setFilter] = useState('')
  const filteredItems = useMemo(() => {
    const filtered = filter
      ? items.filter(i => i.name.toLowerCase().includes(filter.toLowerCase()))
      : items
    return sortBy(filtered, i => i.date).reverse()
  }, [items, filter])
  const match = useMatch({ path: '/', end: true })

  return (
    <div className="h-full flex-1 overflow-y-auto bg-teal-600">
      <header className="flex items-center justify-between bg-teal-900 p-4">
        <Link
          to="/"
          className="flex items-center text-sm font-semibold uppercase tracking-wide text-white hover:opacity-80 active:opacity-60"
        >
          <Icon className="mr-3 h-6 w-6" name="collection" />
          <div className="text-xs">
            Item
            <br />
            Record
            <br />
            System
          </div>
        </Link>
        <Link
          className={`${BUTTON_BASE_STYLE} bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800`}
          to="/new"
        >
          <Icon name="plus" className="mr-2" /> Item
        </Link>
      </header>
      <div className="sticky top-0 z-10 bg-teal-600 p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-3">
            <Icon className="text-teal-900" name="search" />
          </div>
          <input
            className="w-full rounded-3xl bg-teal-700 py-2 pl-10 pr-3 text-white shadow-inner placeholder:text-white placeholder:opacity-75 focus:outline-none focus:outline-offset-0 focus:outline-white/75"
            type="search"
            placeholder="Search items"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      </div>
      <ul className="space-y-1">
        {filteredItems.map(item => (
          <li key={item.id}>
            <NavLink
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2 text-white hover:bg-teal-700 ${
                  isActive ? 'bg-teal-700' : ''
                }`
              }
              to={item.id}
            >
              <Avatar name={item.name} image={item.image} />
              <div>
                {item.name}
                <div className="flex items-center text-sm opacity-75">
                  <Icon className="mr-1 h-4 w-4" name="calendar" />
                  {format(item.date, DATE_FORMAT)}
                </div>
              </div>
            </NavLink>
          </li>
        ))}
      </ul>
      {match && (
        <Navigate to={filteredItems.length > 0 ? filteredItems[0].id : 'new'} />
      )}
    </div>
  )
}
