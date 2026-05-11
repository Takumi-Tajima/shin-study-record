import { useForm, SubmitHandler } from 'react-hook-form'
import { Dialog, Portal, Input, Button, Text, Stack } from '@chakra-ui/react'
import { supabase } from '../../supabaseClient'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => Promise<void>
}

type Inputs = {
  studyContent: string
  studyTime: number
}

export const RecordForm = ({ open, onOpenChange, onCreated }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { error } = await supabase.from('study-record').insert([
      { title: data.studyContent, time: data.studyTime },
    ])
    if (error) {
      console.error(error)
      return
    }
    reset()
    onOpenChange(false)
    await onCreated()
  }

  const handleCancel = () => {
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => onOpenChange(e.open)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.Header>
                <Dialog.Title>新規レコード</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Stack gap={4}>
                  <Stack gap={1}>
                    <Input
                      placeholder='勉強内容'
                      {...register('studyContent', {
                        required: '内容の入力は必須です',
                      })}
                    />
                    {errors.studyContent && (
                      <Text color='red.500' fontSize='sm'>
                        {errors.studyContent.message}
                      </Text>
                    )}
                  </Stack>
                  <Stack gap={1}>
                    <Input
                      type='number'
                      placeholder='勉強時間'
                      {...register('studyTime', {
                        required: '時間の入力は必須です',
                        min: {
                          value: 0,
                          message: '時間は0以上である必要があります',
                        },
                        valueAsNumber: true,
                      })}
                    />
                    {errors.studyTime && (
                      <Text color='red.500' fontSize='sm'>
                        {errors.studyTime.message}
                      </Text>
                    )}
                  </Stack>
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button type='button' variant='outline' onClick={handleCancel}>
                  キャンセル
                </Button>
                <Button type='submit'>登録</Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger />
            </form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
