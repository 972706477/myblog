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

const statusVariant = {
  进行中: 'info',
  已完成: 'success',
  已归档: 'neutral',
}

// 项目管理：表格 + 新建/编辑/删除
export default function ProjectList() {
  const router = useRouter()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  const refresh = async () => {
    setLoading(true)
    setProjects(await api.listProjects())
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleDelete = async () => {
    if (!deleting) return
    await api.deleteProject(deleting.slug)
    setDeleting(null)
    await refresh()
  }

  const columns = [
    {
      key: 'name',
      header: '项目',
      width: proportional(2, {minWidth: 200}),
      renderCell: (row) => (
        <Link href={`/admin/projects/${row.slug}`}>
          <Stack gap={1}>
            <Text type="label">{row.name}</Text>
            <Text type="supporting" maxLines={1}>
              {row.tagline}
            </Text>
          </Stack>
        </Link>
      ),
    },
    {
      key: 'status',
      header: '状态',
      width: proportional(1, {minWidth: 90}),
      renderCell: (row) => <Badge variant={statusVariant[row.status]} label={row.status} />,
    },
    {
      key: 'year',
      header: '年份',
      width: pixel(80),
      renderCell: (row) => <Text hasTabularNumbers>{row.year}</Text>,
    },
    {
      key: 'stack',
      header: '技术栈',
      width: proportional(2, {minWidth: 160}),
      renderCell: (row) => (
        <HStack gap={1} wrap="wrap">
          {row.stack.map((tech) => (
            <Badge key={tech} variant="blue" label={tech} />
          ))}
        </HStack>
      ),
    },
    {
      key: 'featured',
      header: '置顶',
      width: pixel(70),
      renderCell: (row) =>
        row.featured ? <Badge variant="purple" label="置顶" /> : <Text type="supporting">—</Text>,
    },
    {
      key: 'actions',
      header: '操作',
      width: pixel(150),
      renderCell: (row) => (
        <HStack gap={1}>
          <Button label="编辑" size="sm" variant="ghost" onClick={() => router.push(`/admin/projects/${row.slug}`)} />
          <Button label="删除" size="sm" variant="ghost" onClick={() => setDeleting(row)} />
        </HStack>
      ),
    },
  ]

  return (
    <Stack gap={4}>
      <HStack justify="between" vAlign="center" wrap="wrap" gap={3}>
        <Heading level={1} type="display-2">
          项目管理
        </Heading>
        <Button label="新建项目" variant="primary" onClick={() => router.push('/admin/projects/new')} />
      </HStack>

      {loading ? (
        <Text type="supporting">加载中…</Text>
      ) : (
        <Table
          data={projects}
          columns={columns}
          label="项目列表"
          emptyState={<Text type="supporting">还没有项目，点击右上角“新建项目”开始吧。</Text>}
        />
      )}

      <DeleteDialog
        isOpen={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        itemName={deleting?.name ?? ''}
        onConfirm={handleDelete}
      />
    </Stack>
  )
}
