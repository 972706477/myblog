import AboutView from '@/components/AboutView'
import {getAllNotes, getAllProjects, getSiteInfo} from '@/lib/data'

// 关于页（服务端组件）：构建时从数据库读取
export default async function About() {
  const [projects, notes, site] = await Promise.all([getAllProjects(), getAllNotes(), getSiteInfo()])
  return <AboutView projects={projects} notes={notes} author={site.author} />
}
