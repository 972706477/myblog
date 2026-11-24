'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {Badge} from '@astryxdesign/core/Badge'
import {Button} from '@astryxdesign/core/Button'
import {HStack} from '@astryxdesign/core/HStack'
import {Heading} from '@astryxdesign/core/Heading'
import {Link} from '@astryxdesign/core/Link'
import {Stack} from '@astryxdesign/core/Stack'
import {Table} from '@astryxdesign/core/Table'
import {pixel, proportional} from '@astryxdesign/core/Table/utils'
import {Text} from '@astryxdesign/core/Text'
import {api} from '@/lib/api'
import DeleteDialog from '@/components/DeleteDialog'

// 笔记管理：表格 + 新建/编辑/删除
export default function NoteList() {
  const router = useRouter()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  const refresh = async () => {
    setLoading(true)
    setNotes(await api.listNotes())
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleDelete = async () => {
    if (!deleting) return
    await api.deleteNote(deleting.slug)
    setDeleting(null)
    await refresh()
  }

  const columns = [
    {
      key: 'title',
      header: '标题',
      width: proportional(2, {minWidth: 200}),
      renderCell: (row) => (
        <Link href={`/admin/notes/${row.slug}`}>
          <Stack gap={1}>
            <Text type="label">{row.title}</Text>
            <Text type="supporting" maxLines={1}>
              {row.excerpt}
            </Text>
          </Stack>
        </Link>
      ),
    },
    {
      key: 'tags',
      header: '标签',
      width: proportional(1, {minWidth: 120}),
      renderCell: (row) => (
        <HStack gap={1} wrap="wrap">
          {row.tags.map((tag) => (
            <Badge key={tag} variant="teal" label={tag} />
          ))}
        </HStack>
      ),
    },
    {
      key: 'date',
      header: '发布日期',
      width: pixel(110),
      renderCell: (row) => <Text hasTabularNumbers>{row.date}</Text>,
    },
    {
      key: 'readingTime',
      header: '阅读时长',
      width: pixel(100),
      renderCell: (row) => <Text hasTabularNumbers>{row.readingTime} 分钟</Text>,
    },
    {
      key: 'actions',
      header: '操作',
      width: pixel(150),
      renderCell: (row) => (
        <HStack gap={1}>
          <Button label="编辑" size="sm" variant="ghost" onClick={() => router.push(`/admin/notes/${row.slug}`)} />
          <Button label="删除" size="sm" variant="ghost" onClick={() => setDeleting(row)} />
        </HStack>
      ),
    },
  ]

  return (
    <Stack gap={4}>
      <HStack justify="between" vAlign="center" wrap="wrap" gap={3}>
        <Heading level={1} type="display-2">
          笔记管理
        </Heading>
        <Button label="新建笔记" variant="primary" onClick={() => router.push('/admin/notes/new')} />
      </HStack>

      {loading ? (
        <Text type="supporting">加载中…</Text>
      ) : (
        <Table
          data={notes}
          columns={columns}
          label="笔记列表"
          emptyState={<Text type="supporting">还没有笔记，点击右上角“新建笔记”开始吧。</Text>}
        />
      )}

      <DeleteDialog
        isOpen={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        itemName={deleting?.title ?? ''}
        onConfirm={handleDelete}
      />
    </Stack>
  )
}
