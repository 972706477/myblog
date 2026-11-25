import ContentRecommendations from '@/components/ContentRecommendations'
import {recommend} from '@/lib/recommendations'
import {notFound} from 'next/navigation'
import ProjectDetail from '@/components/ProjectDetail'
import {getAllNotes, getAllProjects} from '@/lib/data'

// SSG：构建时为每个项目生成一个静态 HTML 页面
export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map((p) => ({slug: p.slug}))
}

// 每个项目页的浏览器标题
export async function generateMetadata({params}) {
  const {slug} = await params
  const projects = await getAllProjects()
  const project = projects.find((p) => p.slug === slug)
  return {title: project ? project.name : '项目不存在'}
}

export default async function Page({params}) {
  const {slug} = await params
  const [notes, projects] = await Promise.all([getAllNotes(), getAllProjects()])
  const index = projects.findIndex((p) => p.slug === slug)
  if (index === -1) notFound()

  const project = projects[index]
  // 数组按从新到旧排列：index-1 是更新的，index+1 是更早的
  return (
    <ProjectDetail
      project={project}
      recommendations={<ContentRecommendations items={recommend(project, "projects", notes, projects)} />}
      newer={index > 0 ? projects[index - 1] : null}
      older={index < projects.length - 1 ? projects[index + 1] : null}
    />
  )
}
