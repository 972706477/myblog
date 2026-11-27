'use client'

import {useState} from 'react'
import dynamic from 'next/dynamic'

const Glass = dynamic(() => import('./canvasui/Glass').then(m => m.Glass), {ssr: false})
const ParticleReveal = dynamic(() => import('./canvasui/ParticleReveal').then(m => m.ParticleReveal), {ssr: false})

function canAnimate() {
  return window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches
}

export function QuietGlass({children, style}) {
  const [active, setActive] = useState(false)
  return <div style={{minWidth: 0, ...style}} onMouseEnter={() => setActive(canAnimate())} onMouseLeave={() => setActive(false)}>
    {active ? <Glass size={48} ior={1.05} depth={8} aberration={0} blur={0} reflection={0.12} shine={0.08} zoom={1} follow={0.5}>{children}</Glass> : children}
  </div>
}

export function ProfileParticles() {
  const [active, setActive] = useState(false)
  const artwork = <div style={{height: 80, display: 'flex', alignItems: 'center', gap: 12, padding: 16}}>{['#5886ff', '#8fa6ff', '#5dc8ce', '#b8c4ee'].map((color, index) => <span key={color} style={{display:'block', width: 18 + index * 6, height: 18 + index * 6, borderRadius: '50%', background: color}} />)}</div>
  return <div aria-hidden="true" style={{height:80, marginBottom:16, borderRadius:12, overflow:'hidden'}} onMouseEnter={() => setActive(canAnimate())} onMouseLeave={() => setActive(false)}>
    {active ? <ParticleReveal radius={140} scatter={3} drift={0} aberration={0} bend={0} fade={0.25} size={1} background="#1c1c1e">{artwork}</ParticleReveal> : artwork}
  </div>
}
