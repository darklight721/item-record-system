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
    <div className="mx-auto my-24 max-w-2xl overflow-hidden rounded-md bg-white shadow">
      <header className="flex items-center justify-between p-3 shadow">
        <Link
          to="/"
          className="flex items-center text-lg font-semibold hover:text-blue-500 active:text-blue-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
          Item Record System
        </Link>
        <nav>
          <NavLink
            to="new"
            className={({ isActive }) =>
              `flex items-center rounded-md border-2 border-blue-500 px-3 py-2 hover:border-blue-500 hover:bg-blue-500 hover:text-white active:border-blue-600 active:bg-blue-600 ${
                isActive ? 'border-blue-600 bg-blue-600 text-white' : ''
              }`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            New
          </NavLink>
        </nav>
      </header>
      <main className="flex">
        <section className="w-2/5 shadow">
          <List items={items} />
        </section>
        <section className="flex-1">
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
