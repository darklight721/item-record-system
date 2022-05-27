import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Item from '../Item'
import List from '../List'
import Icon from '../Icon'
import { getItems, saveItems } from '../../store'

export default function App() {
  const [items, setItems] = useState(() => getItems())
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    saveItems(items)
  }, [items])

  return (
    <div className="mx-auto h-full max-h-full min-h-[24rem] w-full md:h-[48rem] md:w-[42rem] md:py-20">
      <main className="flex h-full w-full overflow-hidden bg-white md:rounded-md md:shadow-md">
        <section
          className={`fixed top-0 left-0 z-10 flex h-full w-full transition-transform md:static md:w-2/5 md:translate-x-0 ${
            showMenu ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={e => {
            if ((e.target as Element).closest('a')) setShowMenu(false)
          }}
        >
          <List items={items} />
          <button
            className="h-full w-auto bg-gray-700/60 p-5 text-white md:hidden"
            type="button"
            onClick={() => setShowMenu(false)}
          >
            <Icon name="chevronLeft" />
          </button>
        </section>
        <section className="h-full flex-1">
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
                  removeItem={id =>
                    setItems(prev => prev.filter(i => i.id !== id))
                  }
                />
              }
            />
            <Route path="*" element={null} />
          </Routes>
          <button
            className="fixed top-0 left-0 m-4 rounded-full bg-teal-700 p-4 text-white shadow-md hover:bg-teal-800 active:bg-teal-900 md:hidden"
            type="button"
            onClick={() => setShowMenu(true)}
          >
            <Icon name="collection" />
          </button>
        </section>
      </main>
    </div>
  )
}
