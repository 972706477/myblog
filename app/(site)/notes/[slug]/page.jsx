import {notFound} from 'next/navigation'
import NoteDetail from '@/components/NoteDetail'
import {getAllNotes} from '@/lib/data'

// SSG：构建时为每篇笔记生成一个静态 HTML 页面
export async function generateStaticParams() {
  const notes = await getAllNotes()
  return notes.map((n) => ({slug: n.slug}))
}

// 每篇笔记的浏览器标题
export async function generateMetadata({params}) {
  const {slug} = await params
  const notes = await getAllNotes()
  const note = notes.find((n) => n.slug === slug)
  return {title: note ? note.title : '笔记不存在'}
}

export default async function Page({params}) {
  const {slug} = await params
  const notes = await getAllNotes()
  const index = notes.findIndex((n) => n.slug === slug)
  if (index === -1) notFound()

  const note = notes[index]
  // 数组按发布时间从新到旧排列：index-1 是更新的，index+1 是更早的
  return (
    <NoteDetail
      note={note}
      newer={index > 0 ? notes[index - 1] : null}
      older={index < notes.length - 1 ? notes[index + 1] : null}
    />
  )
}
