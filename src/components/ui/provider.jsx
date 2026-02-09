'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'
import { myTheme } from '@/theme/theme'

export function Provider(props) {
  return (
    <ChakraProvider value={myTheme}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
