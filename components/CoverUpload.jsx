'use client'

import {useState} from 'react'
import {api} from '@/lib/api'

export default function CoverUpload({value, onChange, disabled, onBusyChange}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  return <fieldset disabled={disabled || uploading} style={{border: 0, padding: 0, margin: 0}}>
    <legend style={{fontWeight: 600, marginBottom: 12}}>展示封面</legend>
    {value && <img src={value} alt="当前封面预览" style={{width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 12, marginBottom: 12}} />}
    <label>上传图片（PNG、JPEG、GIF、WebP，最大 5 MB）<input type="file" accept="image/png,image/jpeg,image/gif,image/webp" style={{display: 'block', marginTop: 8}} onChange={async event => {
      const file = event.currentTarget.files?.[0]
      event.currentTarget.value = ''
      if (!file) return
      setError('')
      if (file.size > 5 * 1024 * 1024) {setError('封面不能超过 5 MB'); return}
      setUploading(true)
      onBusyChange?.(true)
      try {
        const body = new FormData()
        body.append('image', file)
        const response = await fetch('/api/note-images', {method: 'POST', headers: {Authorization: `Bearer ${api.getToken() ?? ''}`}, body})
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || '封面上传失败')
        onChange(result.url)
      } catch (error) {setError(error.message)} finally {setUploading(false); onBusyChange?.(false)}
    }} /></label>
    {value && <button type="button" onClick={() => onChange('')} style={{marginTop: 12}}>移除封面</button>}
    <p role="status">{uploading ? '正在上传，完成后请保存…' : error || '上传后请保存。未设置封面时使用原有展示方式。'}</p>
  </fieldset>
}
