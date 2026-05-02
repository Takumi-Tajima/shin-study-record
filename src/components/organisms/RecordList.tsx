import { List } from '@chakra-ui/react'
import { Record } from '../../domain/record'

type Props = { records: Record[] }

export const RecordList = ({ records }: Props) => (
  <List.Root>
    {records.map((r) => (
      <List.Item key={r.id}>
        {r.title}（{r.time}m）
      </List.Item>
    ))}
  </List.Root>
)
