import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Record } from '../domain/record'
import { StudyRecordsTemplate } from '../components/templates/StudyRecordsTemplate'
import { RecordList } from '../components/organisms/RecordList'
import { LoadingSpinner } from '../components/atoms/LoadingSpinner'
import { Button } from '@chakra-ui/react'

export const StudyRecordsPage = () => {
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(true)

  // const [studyContent, setStudyContent] = useState('')
  // const [studyTime, setStudyTime] = useState('')

  // ここにインサートする処理を追記する
  const insertRecord = async () => {
    await supabase.from('study-record').insert([
      { title: '勉強をするぜ', time: 120 },
    ])
  }

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
    <>
      <StudyRecordsTemplate>
        {loading ? <LoadingSpinner /> : <RecordList records={records} />}
      </StudyRecordsTemplate>

      {/* // ここでフォームを表示する */}
      <Button onClick={insertRecord}>レコードを追加</Button>
    </>
  )
}