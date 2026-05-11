import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Record } from '../domain/record'
import { StudyRecordsTemplate } from '../components/templates/StudyRecordsTemplate'
import { RecordList } from '../components/organisms/RecordList'
import { RecordForm } from '../components/organisms/RecordForm'
import { LoadingSpinner } from '../components/atoms/LoadingSpinner'
import { Button } from '@chakra-ui/react'

export const StudyRecordsPage = () => {
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const fetchRecords = async () => {
    const { data, error } = await supabase.from('study-record').select('*')
    if (error) {
      console.error(error)
      return
    }
    if (data) {
      const recordList: Record[] = data.map(
        (row) => new Record(row.id, row.title, row.time),
      )
      setRecords(recordList)
    }
  }

  useEffect(() => {
    fetchRecords().finally(() => setLoading(false))
  }, [])

  return (
    <StudyRecordsTemplate>
      {loading ? <LoadingSpinner /> : <RecordList records={records} />}
      <Button onClick={() => setOpen(true)}>レコードを追加</Button>
      <RecordForm open={open} onOpenChange={setOpen} onCreated={fetchRecords} />
    </StudyRecordsTemplate>
  )
}
