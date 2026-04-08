import { supabase } from './supabaseClient'
import { useEffect, useState } from 'react'

export const  StudyRecords = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecords = async () => {
      const { data, error } = await supabase.from('study-record').select('*')
      if (error) console.error(error)
      else setRecords(data)
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
