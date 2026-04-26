import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Record } from '../domain/record'
import { StudyRecordsTemplate } from '../components/templates/StudyRecordsTemplate'
import { RecordList } from '../components/organisms/RecordList'
import { LoadingSpinner } from '../components/atoms/LoadingSpinner'

export const StudyRecordsPage = () => {
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecords = async () => {
      const { data, error } = await supabase.from('study-record').select('*')
      if (error) {
        console.error(error)
      } else if (data) {
        const recordList: Record[] = data.map(
          (row) => new Record(row.id, row.title, row.time),
        )
        setRecords(recordList)
      }
      setLoading(false)
    }
    fetchRecords()
  }, [])

  return (
    <StudyRecordsTemplate>
      {loading ? <LoadingSpinner /> : <RecordList records={records} />}
    </StudyRecordsTemplate>
  )
}
