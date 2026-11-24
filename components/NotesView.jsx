'use client'

import {useState} from 'react'
import {Button} from '@astryxdesign/core/Button'
import {EmptyState} from '@astryxdesign/core/EmptyState'
import {HStack} from '@astryxdesign/core/HStack'
import {Heading} from '@astryxdesign/core/Heading'
import {SegmentedControl, SegmentedControlItem} from '@astryxdesign/core/SegmentedControl'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'
import NoteList from './NoteList.jsx'

// 笔记列表视图：按标签筛选（数据由服务端页面传入）
export default function NotesView({notes}) {
  const [activeTag, setActiveTag] = useState('全部')
  const allTags = [...new Set(notes.flatMap((n) => n.tags))]
  const visible = activeTag === '全部' ? notes : notes.filter((n) => n.tags.includes(activeTag))

  return (
    <Stack gap={6} paddingBlock={6}>
      <Stack gap={2} maxWidth={720}>
        <Heading level={1} type="display-2">
          技术笔记
        </Heading>
        <Text type="large">学 React、学工程化的过程记录。项目里用到的技术，这里展开讲。</Text>
      </Stack>

      <HStack justify="between" vAlign="center" wrap="wrap" gap={3}>
        <SegmentedControl value={activeTag} onChange={setActiveTag} label="按标签筛选笔记">
          <SegmentedControlItem value="全部" label="全部" />
          {allTags.map((tag) => (
            <SegmentedControlItem key={tag} value={tag} label={tag} />
          ))}
        </SegmentedControl>
        <Text type="supporting">共 {visible.length} 篇</Text>
      </HStack>

      {visible.length === 0 ? (
        <EmptyState
          title="这个标签下还没有笔记"
          description="换一个标签看看。"
          actions={<Button label="查看全部笔记" variant="secondary" onClick={() => setActiveTag('全部')} />}
        />
      ) : (
        <NoteList list={visible} />
      )}
    </Stack>
  )
}
