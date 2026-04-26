import { Container, Stack } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { PageTitle } from '../atoms/PageTitle'

type Props = { children: ReactNode }

export const StudyRecordsTemplate = ({ children }: Props) => (
  <Container maxW="2xl" py={8}>
    <Stack gap={6}>
      <PageTitle>シン・学習記録</PageTitle>
      {children}
    </Stack>
  </Container>
)
