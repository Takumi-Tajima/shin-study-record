import { Heading } from '@chakra-ui/react'
import type { ReactNode } from 'react'

type Props = { children: ReactNode }

export const PageTitle = ({ children }: Props) => (
  <Heading as="h1" size="2xl">
    {children}
  </Heading>
)
