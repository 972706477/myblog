export const dynamic = 'force-dynamic'

import NotesView from '@/components/NotesView'
import {getAllNotes} from '@/lib/data'

// 笔记列表（服务端组件）：构建时从数据库读取
export default async function Notes() {
  const notes = await getAllNotes()
  return <NotesView notes={notes} />
}
