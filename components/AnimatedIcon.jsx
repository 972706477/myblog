'use client'

import {useEffect, useRef, useState} from 'react'
import {Icon} from '@astryxdesign/core/Icon'
import styles from './AnimatedIcon.module.css'

export default function AnimatedIcon({name = '文件夹', size = 28}) {
  const host = useRef(null)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let disposed = false
    let cleanup
    setReady(false)
    import('@/lib/kubai-icons/line-runtime').then(({mountBlogIcon}) => {
      if (disposed || !host.current) return
      cleanup = mountBlogIcon(name, host.current, host.current.closest('a,button,[role="button"]') || host.current.parentElement.parentElement)
      setReady(true)
    }).catch(() => {})
    return () => {disposed = true; cleanup?.()}
  }, [name])
  const fallback = {'搜索': 'search', '上传': 'upload', '文档': 'viewColumns', '文件夹': 'wrench'}[name] || 'wrench'
  return <span className={styles.icon} style={{width: size, height: size, position: 'relative'}} aria-hidden="true">
    {!ready && <Icon icon={fallback} style={{width: size, height: size}} />}
    <span ref={host} style={{position:'absolute', inset:0, opacity:ready ? 1 : 0}} />
  </span>
}
