'use client'

import {Component, useState} from 'react'
import dynamic from 'next/dynamic'
import styles from './QuietEffects.module.css'

const ParticleReveal = dynamic(() => import('./canvasui/ParticleReveal').then(m => m.ParticleReveal), {ssr: false})

class DecorationBoundary extends Component {
  state = {failed: false}
  static getDerivedStateFromError() {return {failed: true}}
  render() {return this.state.failed ? null : this.props.children}
}

function canAnimate() {
  return window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches
}

export function QuietGlass({children, style}) {
  return <div className={styles.glass} style={{minWidth: 0, ...style}}>
    {children}
    <span className={styles.highlight} aria-hidden="true" />
  </div>
}

export function ProfileParticles() {
  const [active, setActive] = useState(false)
  const artwork = <div style={{height: 80, display: 'flex', alignItems: 'center', gap: 12, padding: 16}}>{['#5886ff', '#8fa6ff', '#5dc8ce', '#b8c4ee'].map((color, index) => <span key={color} style={{display:'block', width: 18 + index * 6, height: 18 + index * 6, borderRadius: '50%', background: color}} />)}</div>
  return <div aria-hidden="true" style={{height:80, marginBottom:16, borderRadius:12, overflow:'hidden'}} onMouseEnter={() => setActive(canAnimate())} onMouseLeave={() => setActive(false)}>
    <div style={{position:'relative',height:80}}>
      {artwork}
      {active && <DecorationBoundary><div style={{position:'absolute',inset:0,pointerEvents:'none'}}><ParticleReveal radius={140} scatter={3} drift={0} aberration={0} bend={0} fade={0.25} size={1} background="#1c1c1e">{artwork}</ParticleReveal></div></DecorationBoundary>}
    </div>
  </div>
}
