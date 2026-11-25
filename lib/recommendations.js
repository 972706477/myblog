function topics(item) {
  return new Set((item.tags ?? item.stack ?? []).map(value => value.trim().toLowerCase()).filter(Boolean))
}

export function recommend(current, kind, notes, projects) {
  const currentTopics = topics(current)
  return [...notes.map(item => ({item, kind: 'notes'})), ...projects.map(item => ({item, kind: 'projects'}))]
    .filter(entry => entry.kind !== kind || entry.item.slug !== current.slug)
    .map(entry => ({
      ...entry,
      score: [...topics(entry.item)].filter(topic => currentTopics.has(topic)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({item, kind, score}) => ({
      href: `/${kind}/${item.slug}`,
      title: item.title ?? item.name,
      kind: kind === 'notes' ? '笔记' : '作品',
      matched: score > 0,
    }))
}
