import HomeView from '@/components/HomeView'
import {getAllNotes, getAllProjects, getSiteInfo} from '@/lib/data'

export const dynamic = 'force-dynamic'

// 首页（服务端组件）：构建时从数据库读取，SSG 预渲染
export default async function Home() {
  const [projects, notes, site] = await Promise.all([getAllProjects(), getAllNotes(), getSiteInfo()])
  return <HomeView projects={projects} notes={notes} author={site.author} />
}
