'use client'

import {Component, useEffect, useState} from 'react'
import dynamic from 'next/dynamic'
import styles from './QuietEffects.module.css'

const Asciify = dynamic(() => import('./canvasui/Asciify').then(m => m.Asciify), {ssr: false})

class DecorationBoundary extends Component {
  state = {failed: false}
  static getDerivedStateFromError() {return {failed: true}}
  render() {return this.state.failed ? null : this.props.children}
}

export function QuietGlass({children, style}) {
  return <div className={styles.glass} style={{minWidth: 0, ...style}}>
    {children}
    <span className={styles.highlight} aria-hidden="true" />
  </div>
}

export function FeaturedBackdrop({enabled}) {
  const [reduced, setReduced] = useState(true)
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return <span aria-hidden="true" style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:0}}>
    {enabled && !reduced && <DecorationBoundary><Asciify source="gradient" background="#164dcc" colors={['#2356bb','#488fff','#81e4ff','#effbff']} cellSize={11} radius={135} trail={0.8} flow={0.3} density={0.9} opacity={0.85} contrast={1.4} ambient={0.4} glow={0.2} flicker={0} grain={0} veil={0} click="none" style={{position:'absolute',inset:0}} /></DecorationBoundary>}
  </span>
}

export function ProfileParticles() {
  const [enabled, setEnabled] = useState(false)
  const [reduced, setReduced] = useState(true)
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {setReduced(query.matches); setEnabled(!query.matches)}
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return <section className={styles.experiment} aria-label="互动光迹">
    <div className={styles.canvas}>
      <div aria-hidden="true" className={styles.canvasBase} />
      {enabled && !reduced && <DecorationBoundary><Asciify source="gradient" background="#071a35" colors={['#1e4075','#408bff','#70d9ef','#e2f9ff']} cellSize={10} radius={115} trail={0.8} flow={0.3} density={0.9} opacity={1} contrast={1.4} ambient={0.55} glow={0.25} flicker={0} grain={0} veil={0} click="ring" style={{position:'absolute',inset:0}} /></DecorationBoundary>}
      <div className={styles.canvasLabel}><span>让灵感留下光迹</span><small>{reduced ? '静态展示 · 已遵循减少动态效果设置' : enabled ? '移动鼠标或轻触画布，试试看' : '动态效果已暂停'}</small></div>
    </div>
    <button type="button" className={styles.toggle} disabled={reduced} aria-pressed={enabled && !reduced} onClick={() => setEnabled(value => !value)}>{enabled && !reduced ? '暂停光迹' : '开启光迹'}</button>
  </section>
}
