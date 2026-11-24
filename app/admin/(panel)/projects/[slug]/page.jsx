import ProjectEditor from '@/components/ProjectEditor'

// 编辑项目：把网址里的 slug 传给编辑器组件
export default async function EditProjectPage({params}) {
  const {slug} = await params
  return <ProjectEditor slug={slug} />
}
