import {Button} from '@astryxdesign/core/Button'
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog'
import {HStack} from '@astryxdesign/core/HStack'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'

// 删除确认弹窗（代替浏览器原生 confirm）
export default function DeleteDialog({isOpen, onOpenChange, itemName, onConfirm}) {
  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      purpose="form"
      size="small"
    >
      <DialogHeader title={`删除「${itemName}」？`} />
      <Stack gap={5}>
        <Text type="body">删除后无法恢复。演示模式下再次刷新页面即可恢复初始数据。</Text>
        <HStack justify="end" gap={2}>
          <Button label="取消" variant="ghost" onClick={() => onOpenChange(false)} />
          <Button label="确认删除" variant="destructive" onClick={onConfirm} />
        </HStack>
      </Stack>
    </Dialog>
  )
}
