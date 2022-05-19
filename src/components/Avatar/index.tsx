import { useEffect, useState } from 'react'
import styles from './index.module.css'

type Props = {
  className?: string
  name: string
  image: string
}

export default function Avatar({
  className = 'h-12 w-12 rounded-full text-sm',
  name,
  image
}: Props) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)
  }, [image])

  return (
    <div
      className={`overflow-hidden shadow-inner ${styles.container} ${className}`}
    >
      {image && (
        <img
          className={`h-full w-full object-cover ${
            loaded ? 'block' : 'hidden'
          }`}
          onLoad={() => setLoaded(true)}
          src={image}
          alt={name}
        />
      )}
      {!loaded && (
        <div className="flex h-full w-full items-center justify-center font-bold uppercase text-teal-900">
          {name[0] || '🆕'}
        </div>
      )}
    </div>
  )
}
