import { ReactElement } from 'react'
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import {render, RenderOptions} from '@testing-library/react'

const ChakuraProvider = ({children}: {children: React.ReactNode}) => {
  return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, {wrapper: ChakuraProvider, ...options})

export {customRender as render}
