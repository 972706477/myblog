export const dynamic = 'force-dynamic'

import ProjectsView from '@/components/ProjectsView'
import {getAllProjects} from '@/lib/data'

// 作品列表（服务端组件）：构建时从数据库读取
export default async function Projects() {
  const projects = await getAllProjects()
  return <ProjectsView projects={projects} />
}
