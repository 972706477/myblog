'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {Button} from '@astryxdesign/core/Button'
import {Card} from '@astryxdesign/core/Card'
import {Heading} from '@astryxdesign/core/Heading'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'
import {TextInput} from '@astryxdesign/core/TextInput'
import {api} from '@/lib/api'

// 后台登录页（演示模式：任意非空账号密码都能登录）
export default function Login() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.login({username, password})
      router.replace('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Stack maxWidth={420} paddingBlock={10} style={{marginInline: 'auto'}}>
      <Card padding={6} elevation="low">
        <form onSubmit={handleSubmit}>
          <Stack gap={5}>
            <Stack gap={1}>
              <Heading level={1} type="display-2">
                发布后台
              </Heading>
              <Text type="supporting">登录后可以管理项目和笔记</Text>
            </Stack>

            <Stack gap={4}>
              <TextInput
                label="账号"
                value={username}
                onChange={setUsername}
                placeholder="请输入账号"
              />
              <TextInput
                label="密码"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="请输入密码"
              />
            </Stack>

            {error && <Text type="supporting">{error}</Text>}

            <Button
              label={loading ? '登录中…' : '登录'}
              type="submit"
              variant="primary"
              isLoading={loading}
              width="100%"
            />

            <Text type="supporting">
              演示模式：任意账号密码均可登录。接入真实后端后，这里会校验真实凭据。
            </Text>
          </Stack>
        </form>
      </Card>
    </Stack>
  )
}
