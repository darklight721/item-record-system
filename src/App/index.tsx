import React, { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes } from 'react-router-dom'
import Icon from '../Icon'
import Item from '../Item'
import List from '../List'
import { getItems, saveItems } from '../store'

export default function App() {
  const [items, setItems] = useState(() => getItems())

  useEffect(() => {
    saveItems(items)
  }, [items])

  return (
    <div className="mx-auto box-content h-full w-full md:h-[38rem] md:w-[42rem] md:py-20">
      <div className="flex h-full w-full flex-col divide-y-4 divide-gray-100 overflow-hidden bg-white md:rounded-md md:shadow-md">
        <header className="flex items-center justify-between p-3">
          <Link
            to="/"
            className="flex items-center text-lg font-semibold hover:text-blue-500 active:text-blue-600"
          >
            <Icon className="mr-2" name="collection" />
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
              <Icon className="mr-1" name="plus" />
              New
            </NavLink>
          </nav>
        </header>
        <main className="flex min-h-0 flex-1 items-stretch divide-x-4 divide-gray-100">
          <section className="h-full w-2/5 overflow-y-auto">
            <List items={items} />
          </section>
          <section className="h-full flex-1 overflow-y-auto">
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
                    getItem={id => items.find(i => i.id === id)}
                    saveItem={item =>
                      setItems(prev =>
                        prev.map(i => (i.id === item.id ? item : i))
                      )
                    }
                    removeItem={item =>
                      setItems(prev => prev.filter(i => i.id !== item.id))
                    }
                  />
                }
              />
            </Routes>
          </section>
        </main>
      </div>
    </div>
  )
}
