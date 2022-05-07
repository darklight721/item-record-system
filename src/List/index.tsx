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
    <div>
      <input
        type="search"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>
            <NavLink to={item.id}>
              <>
                {item.name} - {format(item.date, DATE_FORMAT)}
              </>
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
