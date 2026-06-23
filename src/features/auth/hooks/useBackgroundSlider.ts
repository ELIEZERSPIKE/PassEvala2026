import { useState, useEffect } from 'react'

export function useBackgroundSlider(images: string[], interval = 4000) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    }, interval)
    return () => clearInterval(timer)
  }, [images.length, interval])

  return { current, goTo: setCurrent }
}