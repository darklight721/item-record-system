import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Item from '../Item'
import List from '../List'
import { getItems, saveItems } from '../store'

export default function App() {
  const [items, setItems] = useState(() => getItems())

  useEffect(() => {
    saveItems(items)
  }, [items])

  return (
    <div className="mx-auto h-full max-h-full min-h-[24rem] w-full md:h-[48rem] md:w-[42rem] md:py-20">
      <main className="flex h-full w-full items-stretch overflow-hidden bg-white md:rounded-md md:shadow-md">
        <section className="hidden h-full w-2/5 overflow-y-auto bg-teal-600 md:block">
          <List items={items} />
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
  )
}
