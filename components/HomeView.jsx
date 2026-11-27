'use client'
import Link from 'next/link'
import {useSiteTheme} from '@/app/providers'
import s from './HomeView.module.css'
import {Ripple} from './canvasui/Ripple'

function Arrow(){return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>}

export default function HomeView({projects=[],notes=[],author}){
  const {mode}=useSiteTheme()
  const featured=projects.find(p=>p.featured)??projects[0]
  const others=projects.filter(p=>p!==featured).slice(0,3)
  const latest=[...notes].sort((a,b)=>String(b.date).localeCompare(String(a.date))).slice(0,4)
  return <div className={s.home} data-mode={mode}>
    <section className={s.intro} aria-labelledby="home-title">
      <div><h1 id="home-title">你好，我是 <span>{author.name}。</span></h1><p className={s.bio}>{author.bio}</p><div className={s.actions}><Link className={s.primary} href="/projects">探索我的作品 <Arrow/></Link><Link className={s.textLink} href="/about">关于我 <Arrow/></Link></div></div>
      <aside className={s.profile}><span className={s.monogram} aria-hidden="true">{Array.from(author.name||'A')[0]}</span><p>{author.role}</p><div className={s.profileLinks}><Link href="/projects">{projects.length} 个作品</Link><Link href="/notes">{notes.length} 篇笔记</Link></div></aside>
    </section>
    <section className={s.work} aria-labelledby="work-title">
      <header className={s.sectionHead}><h2 id="work-title">把想法，做成作品。</h2><Link className={s.textLink} href="/projects">全部作品 <Arrow/></Link></header>
      {featured?<div className={s.workGrid}><Ripple amplitude={0.35} shine={0.35} trigger="hover" style={{borderRadius:16,overflow:"hidden"}}><Link className={s.featured} href={`/projects/${featured.slug}`}>{featured.coverUrl && <img src={featured.coverUrl} alt="" loading="lazy" style={{width: '100%', aspectRatio: '16 / 9', maxHeight: 280, objectFit: 'cover', borderRadius: 12, marginBottom: 12}} />}<div className={s.meta}><span>精选作品</span><span>{featured.year} / {featured.status}</span></div><div className={s.featureBody}><h3>{featured.name}</h3><p>{featured.tagline}</p></div><div className={s.foot}><div className={s.tags}>{(featured.stack??[]).map(t=><span key={t}>{t}</span>)}</div><span className={s.roundArrow}><Arrow/></span></div></Link></Ripple><div className={s.projectList}>{others.map(p=><Link className={s.project} key={p.slug} href={`/projects/${p.slug}`}>{p.coverUrl && <img src={p.coverUrl} alt="" loading="lazy" style={{width: '100%', aspectRatio: '16 / 9', maxHeight: 280, objectFit: 'cover', borderRadius: 12, marginBottom: 12}} />}<div className={s.meta}><span>{p.year}</span><span>{p.status}</span></div><h3>{p.name}</h3><p>{p.tagline}</p><div className={s.foot}><span>{(p.stack??[]).slice(0,2).join(' / ')}</span><Arrow/></div></Link>)}{!others.length&&<p className={s.empty}>更多想法，正在慢慢实现。</p>}</div></div>:<p className={s.empty}>作品整理中，欢迎先读读下面的笔记。</p>}
    </section>
    <section className={s.notes} aria-labelledby="notes-title"><div className={s.notesIntro}><h2 id="notes-title">边做，边记录。</h2><p>项目之外的思考，<br/>与学习路上的小小收获。</p><Link className={s.textLink} href="/notes">所有笔记 <Arrow/></Link></div><div>{latest.length?latest.map(n=><Link className={s.note} key={n.slug} href={`/notes/${n.slug}`}>{n.coverUrl && <img src={n.coverUrl} alt="" loading="lazy" style={{width: '100%', aspectRatio: '16 / 9', maxHeight: 280, objectFit: 'cover', borderRadius: 12, marginBottom: 12}} />}<div className={s.noteMeta}><time dateTime={n.date}>{String(n.date??'').slice(0,10)}</time><span>{n.readingTime} 分钟阅读</span></div><div className={s.noteTitle}><h3>{n.title}</h3><Arrow/></div><p>{n.excerpt}</p></Link>):<p className={s.empty}>还没有笔记，新的记录很快就来。</p>}</div></section>
  </div>
}
