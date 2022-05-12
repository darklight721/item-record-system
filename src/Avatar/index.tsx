import { useEffect, useState } from 'react'

type Props = {
  className?: string
  imgClassName?: string
  name: string
  image: string
}

export default function Avatar({
  className = 'h-12 w-12 rounded-full',
  imgClassName = 'object-cover',
  name,
  image
}: Props) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)
  }, [image])

  return (
    <div className={`overflow-hidden bg-gray-200 ${className}`}>
      {image && (
        <img
          className={`h-full w-full ${imgClassName} ${
            loaded ? 'block' : 'hidden'
          }`}
          onLoad={() => setLoaded(true)}
          src={image}
          alt={name}
        />
      )}
      {!loaded && (
        <div className="flex h-full w-full items-center justify-center uppercase text-black">
          {name[0]}
        </div>
      )}
    </div>
  )
}
