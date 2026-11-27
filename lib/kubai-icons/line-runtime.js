// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// Blog lifecycle adapter around the upstream SF-style motion engine.
import icons from './line-icons.json'
import {attach} from './line-motion.mjs'

export function mountBlogIcon(name, host, trigger) {
  const key = {'文件夹':'folder', '文档':'file-text', '搜索':'search', '上传':'upload'}[name] || 'folder'
  const icon = icons[key]
  host.innerHTML = icon.svg
  const motion = attach(host.querySelector('svg'), icon.fx)
  const enter = () => {if (!matchMedia('(prefers-reduced-motion: reduce)').matches) motion.hover(true)}
  const leave = () => motion.hover(false)
  trigger.addEventListener('mouseenter', enter)
  trigger.addEventListener('mouseleave', leave)
  trigger.addEventListener('focusin', enter)
  trigger.addEventListener('focusout', leave)
  return () => {
    leave()
    trigger.removeEventListener('mouseenter', enter)
    trigger.removeEventListener('mouseleave', leave)
    trigger.removeEventListener('focusin', enter)
    trigger.removeEventListener('focusout', leave)
    host.replaceChildren()
  }
}
