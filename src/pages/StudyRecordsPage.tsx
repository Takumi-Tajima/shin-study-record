import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Record } from '../domain/record'
import { StudyRecordsTemplate } from '../components/templates/StudyRecordsTemplate'
import { RecordList } from '../components/organisms/RecordList'
import { LoadingSpinner } from '../components/atoms/LoadingSpinner'
import { Button } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'

export const StudyRecordsPage = () => {
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(true)

  const [studyContent, setStudyContent] = useState('')
  const [studyTime, setStudyTime] = useState('')

  const handleChangeStudyContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudyContent(e.target.value)
  }

  const handleChangeStudyTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudyTime(e.target.value)
  }

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

  const insertRecord = async () => {
    const { error } = await supabase.from('study-record').insert([
      { title: studyContent, time: Number(studyTime) },
    ])
    if (error) {
      console.error(error)
      return
    }
    // フォームの中身をリセット
    setStudyContent('')
    setStudyTime('')
    await fetchRecords()
  }

  return (
    <>
      <StudyRecordsTemplate>
        {loading ? <LoadingSpinner /> : <RecordList records={records} />}
        <Input placeholder='勉強内容' value={studyContent} onChange={handleChangeStudyContent}/>
        <Input placeholder='勉強時間' value={studyTime} onChange={handleChangeStudyTime}/>
        <Button onClick={insertRecord}>レコードを追加</Button>
      </StudyRecordsTemplate>
    </>
  )
}