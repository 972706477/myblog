import {QuietGlass} from './QuietEffects'
import {Badge} from '@astryxdesign/core/Badge'
import {Divider} from '@astryxdesign/core/Divider'
import {HStack} from '@astryxdesign/core/HStack'
import {Link} from '@astryxdesign/core/Link'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'

// 笔记列表行：日期 | 标题 + 摘要 | 标签
// （从 Home.jsx 提取出来，首页和笔记页共用——消除页面间的横向依赖）
export default function NoteList({list}) {
  return (
    <Stack gap={0}>
      {list.map((note, i) => (
        <Stack key={note.slug} gap={0}>
          {i > 0 && <Divider />}
          <Link href={`/notes/${note.slug}`} isStandalone>
            <HStack gap={4} vAlign="center" wrap="wrap" paddingBlock={3}>
              {note.coverUrl && <QuietGlass><img src={note.coverUrl} alt="" loading="lazy" style={{width: 140, maxWidth: '100%', aspectRatio: '16 / 9', objectFit: 'cover', borderRadius: 10}} /></QuietGlass>}
              <Text type="supporting" hasTabularNumbers width={96}>
                {note.date}
              </Text>
              <Stack gap={1} style={{flex: '1 1 260px', minWidth: 0}}>
                <Text type="label">{note.title}</Text>
                <Text type="supporting" maxLines={1}>
                  {note.excerpt}
                </Text>
              </Stack>
              <HStack gap={1} wrap="wrap">
                {note.tags.map((tag) => (
                  <Badge key={tag} variant="teal" label={tag} />
                ))}
              </HStack>
            </HStack>
          </Link>
        </Stack>
      ))}
    </Stack>
  )
}
