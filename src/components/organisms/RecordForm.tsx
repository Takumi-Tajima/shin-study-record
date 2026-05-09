import { useState } from 'react'
import { Dialog, Portal, Input, Button, Text, Stack } from '@chakra-ui/react'
import { supabase } from '../../supabaseClient'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => Promise<void>
}

export const RecordForm = ({ open, onOpenChange, onCreated }: Props) => {
  const [studyContent, setStudyContent] = useState('')
  const [studyTime, setStudyTime] = useState('')
  const [contentError, setContentError] = useState('')
  const [timeError, setTimeError] = useState('')

  const handleChangeStudyContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudyContent(e.target.value)
  }

  const handleChangeStudyTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudyTime(e.target.value)
  }

  const validate = () => {
    let valid = true

    if (!studyContent) {
      setContentError('内容の入力は必須です')
      valid = false
    } else {
      setContentError('')
    }

    if (!studyTime) {
      setTimeError('時間の入力は必須です')
      valid = false
    } else if (Number(studyTime) < 0) {
      setTimeError('時間は0以上である必要があります')
      valid = false
    } else {
      setTimeError('')
    }

    return valid
  }

  const resetForm = () => {
    setStudyContent('')
    setStudyTime('')
    setContentError('')
    setTimeError('')
  }

  const insertRecord = async () => {
    if (!validate()) return

    const { error } = await supabase.from('study-record').insert([
      { title: studyContent, time: Number(studyTime) },
    ])
    if (error) {
      console.error(error)
      return
    }
    resetForm()
    onOpenChange(false)
    await onCreated()
  }

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
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
              <Stack gap={4}>
                <Stack gap={1}>
                  <Input
                    placeholder='勉強内容'
                    value={studyContent}
                    onChange={handleChangeStudyContent}
                  />
                  {contentError && (
                    <Text color='red.500' fontSize='sm'>
                      {contentError}
                    </Text>
                  )}
                </Stack>
                <Stack gap={1}>
                  <Input
                    type='number'
                    placeholder='勉強時間'
                    value={studyTime}
                    onChange={handleChangeStudyTime}
                  />
                  {timeError && (
                    <Text color='red.500' fontSize='sm'>
                      {timeError}
                    </Text>
                  )}
                </Stack>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant='outline' onClick={handleCancel}>
                キャンセル
              </Button>
              <Button onClick={insertRecord}>登録</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
