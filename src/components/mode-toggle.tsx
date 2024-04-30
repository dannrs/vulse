'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'


import { useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'

const ModeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }


  return (
    <Button variant='ghost' size='sm' onClick={toggleTheme}>
      {resolvedTheme === 'dark' ? (
        <Moon className='h-4 w-4' />
      ) : (
        <Sun className='h-4 w-4' />
      )}
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}

export default ModeToggle
