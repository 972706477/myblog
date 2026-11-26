// Markdown inline images, including angle-bracket paths and optional titles.
const imagePattern = /(!\[(?:\\.|[^\]\\])*\]\(\s*)(<[^>\n]+>|(?:[^\s()]|\([^()\n]*\))+)(?=\s|\))/g

export async function resolveMarkdownImages(content, markdownPath, files, upload) {
  const byPath = new Map(files.map(file => [file.webkitRelativePath, file]))
  const results = new Map()
  const missing = []
  for (const [, , destination] of content.matchAll(imagePattern)) {
    if (results.has(destination)) continue
    const source = destination.replace(/^<|>$/g, '')
    if (/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(source)) continue
    const path = new URL(source, 'https://local.invalid/' + markdownPath.split('/').map(encodeURIComponent).join('/')).pathname
    const file = byPath.get(decodeURIComponent(path).slice(1))
    if (file) {
      results.set(destination, await upload(file))
    } else {
      missing.push(source)
      results.set(destination, destination)
    }
  }
  return {content: content.replace(imagePattern, (match, prefix, destination) =>
    results.has(destination) ? prefix + results.get(destination) : match), missing}
}
