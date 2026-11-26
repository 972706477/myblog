export const dynamic = 'force-dynamic'

import ContentRecommendations from '@/components/ContentRecommendations'
import {recommend} from '@/lib/recommendations'
import {notFound} from 'next/navigation'
import NoteDetail from '@/components/NoteDetail'
import {getAllNotes, getAllProjects} from '@/lib/data'

// 每篇笔记的浏览器标题
export async function generateMetadata({params}) {
  const {slug} = await params
  const notes = await getAllNotes()
  const note = notes.find((n) => n.slug === slug)
  return {title: note ? note.title : '笔记不存在'}
}

export default async function Page({params}) {
  const {slug} = await params
  const [notes, projects] = await Promise.all([getAllNotes(), getAllProjects()])
  const index = notes.findIndex((n) => n.slug === slug)
  if (index === -1) notFound()

  const note = notes[index]
  // 数组按发布时间从新到旧排列：index-1 是更新的，index+1 是更早的
  return (
    <NoteDetail
      note={note}
      recommendations={<ContentRecommendations items={recommend(note, "notes", notes, projects)} />}
      newer={index > 0 ? notes[index - 1] : null}
      older={index < notes.length - 1 ? notes[index + 1] : null}
    />
  )
}
