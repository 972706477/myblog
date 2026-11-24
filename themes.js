// Astryx 的 7 套官方主题。每套主题都由两部分组成：
// 1. theme 对象（JS）——传给 <Theme> 组件，注入设计变量
// 2. theme.css（在 index.css 里引入）——按 data-astryx-theme 属性生效，互不冲突
import {butterTheme} from '@astryxdesign/theme-butter/built'
import {chocolateTheme} from '@astryxdesign/theme-chocolate/built'
import {gothicTheme} from '@astryxdesign/theme-gothic/built'
import {matchaTheme} from '@astryxdesign/theme-matcha/built'
import {neutralTheme} from '@astryxdesign/theme-neutral/built'
import {stoneTheme} from '@astryxdesign/theme-stone/built'
import {y2kTheme} from '@astryxdesign/theme-y2k/built'

export const themes = [
  {name: 'neutral', label: 'Neutral · 中性灰', theme: neutralTheme},
  {name: 'butter', label: 'Butter · 奶油黄', theme: butterTheme},
  {name: 'chocolate', label: 'Chocolate · 巧克力', theme: chocolateTheme},
  {name: 'matcha', label: 'Matcha · 抹茶绿', theme: matchaTheme},
  {name: 'stone', label: 'Stone · 岩石灰', theme: stoneTheme},
  {name: 'gothic', label: 'Gothic · 暗黑哥特', theme: gothicTheme},
  {name: 'y2k', label: 'Y2K · 千禧风', theme: y2kTheme},
]

// 按名字快速取主题对象
export const themeMap = Object.fromEntries(themes.map((t) => [t.name, t.theme]))
