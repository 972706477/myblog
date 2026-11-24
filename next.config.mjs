/** @type {import('next').NextConfig} */
const nextConfig = {
  // Astryx 的 npm 包是 ESM，让 Next 转译它们
  transpilePackages: [
    '@astryxdesign/core',
    '@astryxdesign/theme-neutral',
    '@astryxdesign/theme-butter',
    '@astryxdesign/theme-chocolate',
    '@astryxdesign/theme-matcha',
    '@astryxdesign/theme-stone',
    '@astryxdesign/theme-gothic',
    '@astryxdesign/theme-y2k',
  ],
  // mysql2 只在服务端用，保持外部引用（不打包进客户端）
  serverExternalPackages: ['mysql2'],
}

export default nextConfig
