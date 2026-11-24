import NoteEditor from '@/components/NoteEditor'

// 编辑笔记：把网址里的 slug 传给编辑器组件
export default async function EditNotePage({params}) {
  const {slug} = await params
  return <NoteEditor slug={slug} />
}
