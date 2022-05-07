import React, { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes } from 'react-router-dom'
import Item from '../Item'
import List from '../List'
import { getItems, saveItems } from '../store'

export default function App() {
  const [items, setItems] = useState(() => getItems())

  useEffect(() => {
    saveItems(items)
  }, [items])

  return (
    <div className="sm:container bg-gray-200 rounded-md mx-auto my-24 overflow-hidden">
      <header className="bg-gray-300 flex flex-column items-center space-x-4 px-3 py-2">
        <Link to="/" className="font-semibold text-lg">
          Item record system
        </Link>
        <nav>
          <NavLink to="new">+ New</NavLink>
        </nav>
      </header>
      <main>
        <section>
          <List items={items} />
        </section>
        <section>
          <Routes>
            <Route
              path="new"
              element={
                <Item saveItem={item => setItems(prev => [...prev, item])} />
              }
            />
            <Route
              path=":itemId"
              element={
                <Item
                  readonly
                  getItem={id => items.find(i => i.id === id)}
                  removeItem={item =>
                    setItems(prev => prev.filter(i => i.id !== item.id))
                  }
                />
              }
            />
            <Route
              path=":itemId/edit"
              element={
                <Item
                  getItem={id => items.find(i => i.id === id)}
                  saveItem={item =>
                    setItems(prev =>
                      prev.map(i => (i.id === item.id ? item : i))
                    )
                  }
                />
              }
            />
          </Routes>
        </section>
      </main>
    </div>
  )
}
