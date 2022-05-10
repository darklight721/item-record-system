import { useMemo, useState } from 'react'
import { Navigate, NavLink, useMatch } from 'react-router-dom'
import sortBy from 'lodash.sortby'
import { format } from 'date-fns'
import type { Item } from '../store'
import { DATE_FORMAT } from '../Item'

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
    <div className="flex h-full flex-col">
      <div className="p-3 shadow-sm">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-2.5 h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z"
              clipRule="evenodd"
            />
          </svg>
          <input
            className="w-full rounded-3xl bg-gray-100 py-2 pl-10 pr-3 focus:outline-blue-600"
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
              {item.image ? (
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={item.image}
                  alt={item.name}
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 uppercase text-black">
                  {item.name[0]}
                </div>
              )}
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
