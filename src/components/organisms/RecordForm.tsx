import { useState } from 'react'
import { Dialog, Portal, Input, Button } from '@chakra-ui/react'
import { supabase } from '../../supabaseClient'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => Promise<void>
}

export const RecordForm = ({ open, onOpenChange, onCreated }: Props) => {
  const [studyContent, setStudyContent] = useState('')
  const [studyTime, setStudyTime] = useState('')

  const handleChangeStudyContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudyContent(e.target.value)
  }

  const handleChangeStudyTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudyTime(e.target.value)
  }

  const insertRecord = async () => {
    const { error } = await supabase.from('study-record').insert([
      { title: studyContent, time: Number(studyTime) },
    ])
    if (error) {
      console.error(error)
      return
    }
    setStudyContent('')
    setStudyTime('')
    onOpenChange(false)
    await onCreated()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => onOpenChange(e.open)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>新規レコード</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Input
                placeholder='勉強内容'
                value={studyContent}
                onChange={handleChangeStudyContent}
              />
              <Input
                placeholder='勉強時間'
                value={studyTime}
                onChange={handleChangeStudyTime}
              />
            </Dialog.Body>
            <Dialog.Footer>
              <Button onClick={insertRecord}>登録</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
