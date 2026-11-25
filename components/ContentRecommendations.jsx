import Link from 'next/link'
import {Card} from '@astryxdesign/core/Card'
import {Heading} from '@astryxdesign/core/Heading'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'

export default function ContentRecommendations({items}) {
  if (!items.length) return null
  return (
    <section aria-label="相关推荐">
      <Card padding={5}>
        <Stack gap={3}>
          <Heading level={2}>相关推荐</Heading>
          {items.map(item => (
            <Stack key={item.href} gap={1}>
              <Text type="supporting">{item.kind}{item.matched ? '' : ' · 更多内容'}</Text>
              <Link href={item.href}>{item.title}</Link>
            </Stack>
          ))}
        </Stack>
      </Card>
    </section>
  )
}
