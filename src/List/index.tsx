import { useMemo, useState } from 'react'
import { Navigate, NavLink, useMatch } from 'react-router-dom'
import sortBy from 'lodash.sortby'
import { format } from 'date-fns'
import type { Item } from '../store'
import { DATE_FORMAT } from '../Item'
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
    <div>
      <div className="sticky top-0 border-b border-b-gray-100 bg-white p-3">
        <div className="relative">
          <Icon className="absolute left-3 top-2.5" name="search" />
          <input
            className="w-full rounded-3xl bg-gray-100 py-2 pl-10 pr-3 shadow-inner focus:outline-blue-600"
            type="search"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      </div>
      <ul className="flex-1 divide-y divide-gray-100 overflow-y-auto">
        {filteredItems.map(item => (
          <li key={item.id}>
            <NavLink
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 hover:bg-blue-500 hover:text-white ${
                  isActive ? 'bg-blue-600 text-white' : ''
                }`
              }
              to={item.id}
            >
              <Avatar name={item.name} image={item.image} />
              <div>
                {item.name}
                <div className="text-sm">{format(item.date, DATE_FORMAT)}</div>
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
