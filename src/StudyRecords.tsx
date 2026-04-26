import { supabase } from './supabaseClient'
import { useEffect, useState } from 'react'
import { Record } from './domain/record'

export const  StudyRecords = () => {
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecords = async () => {
      const { data, error } = await supabase.from('study-record').select('*')
      if (error) console.error(error)
      else if (data) {
        const recordList: Record[] = data.map((row) => new Record(row.id, row.title, row.time))
        setRecords(recordList)
      }
      setLoading(false)
    }
    fetchRecords()
  }, [])

  if (loading) return <p>Loading...</p>
  return (
    <ul>
      {records.map(r => <li key={r.id}>{r.title}</li>)}
    </ul>
  )
}
