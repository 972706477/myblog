'use client'

import {useEffect, useState} from 'react'
import {Button} from '@astryxdesign/core/Button'
import {Card} from '@astryxdesign/core/Card'
import {Divider} from '@astryxdesign/core/Divider'
import {HStack} from '@astryxdesign/core/HStack'
import {Heading} from '@astryxdesign/core/Heading'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'
import {TextArea} from '@astryxdesign/core/TextArea'
import {TextInput} from '@astryxdesign/core/TextInput'
import {useToast} from '@astryxdesign/core/Toast'
import {api} from '@/lib/api'

// 站点设置
export default function Settings() {
  const showToast = useToast()
  const [form, setForm] = useState({authorName: '', authorBio: '', siteTitle: ''})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let alive = true
    api.getSettings().then((data) => {
      if (alive) {
        setForm(data)
        setLoading(false)
      }
    })
    return () => {
      alive = false
    }
  }, [])

  const update = (key) => (value) => setForm((prev) => ({...prev, [key]: value}))

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.saveSettings(form)
      showToast({body: '设置已保存', type: 'info'})
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    await api.resetDemoData()
    showToast({body: '已清除本地登录状态', type: 'info'})
  }

  if (loading) return <Text type="supporting">加载中…</Text>

  return (
    <Stack gap={5}>
      <Heading level={1} type="display-2">
        站点设置
      </Heading>

      <Card padding={6}>
        <Stack gap={5}>
          <TextInput
            label="站点标题"
            value={form.siteTitle}
            onChange={update('siteTitle')}
            placeholder="我的博客"
          />
          <TextInput
            label="作者名"
            value={form.authorName}
            onChange={update('authorName')}
            placeholder="Alex"
            description="显示在头像、文章作者等信息处"
          />
          <TextArea
            label="个人简介"
            value={form.authorBio}
            onChange={update('authorBio')}
            rows={3}
            placeholder="一句话介绍自己"
          />
          <HStack gap={2}>
            <Button
              label={saving ? '保存中…' : '保存设置'}
              variant="primary"
              isLoading={saving}
              onClick={handleSave}
            />
          </HStack>
        </Stack>
      </Card>

      <Stack gap={3}>
        <Heading level={2}>数据与接口</Heading>
        <Divider />
        <Text type="supporting">
          内容直接写入服务器 MySQL 数据库（表结构在 database/schema.mysql.sql）。
          接口在 app/api/ 目录，数据库操作在 lib/db.js，前台构建时通过 lib/data.js 读取。
        </Text>
        <HStack>
          <Button label="清除本地登录状态" variant="secondary" onClick={handleReset} />
        </HStack>
      </Stack>

      <Stack gap={3}>
        <Heading level={2}>本地开发提示</Heading>
        <Divider />
        <Text type="supporting">
          数据库连接信息和后台密码在项目根目录的 .env.local 里配置（模板见 .env.example）。
          没配 .env.local 时前台使用静态文件数据，后台无法保存。
        </Text>
      </Stack>
    </Stack>
  )
}
