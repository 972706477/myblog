// ============================================================================
// 数据层：后台的所有读写都走这里
// 现在对接 Next.js 自带的 API 路由（app/api/），最终落到 MySQL。
// 每个方法都返回 Promise，和真实网络请求行为一致。
// ============================================================================

const TOKEN_KEY = 'admin-token'

async function request(path, {method = 'GET', body, auth = false} = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`/api${path}`, {method, headers, body: body !== undefined ? JSON.stringify(body) : undefined})

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `请求失败（${res.status}）`)
  }
  return res.json()
}

export const api = {
  // ---- 登录 ----
  async login({username, password}) {
    const data = await request('/login', {method: 'POST', body: {username, password}})
    localStorage.setItem(TOKEN_KEY, data.token)
    return data
  },

  async logout() {
    localStorage.removeItem(TOKEN_KEY)
    return true
  },

  getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },

  // ---- 项目 ----
  async listProjects() {
    return request('/projects')
  },

  async createProject(data) {
    return request('/projects', {method: 'POST', body: data, auth: true})
  },

  async updateProject(slug, data) {
    return request(`/projects/${encodeURIComponent(slug)}`, {method: 'PUT', body: data, auth: true})
  },

  async deleteProject(slug) {
    return request(`/projects/${encodeURIComponent(slug)}`, {method: 'DELETE', auth: true})
  },

  // ---- 笔记 ----
  async listNotes() {
    return request('/notes')
  },

  async createNote(data) {
    return request('/notes', {method: 'POST', body: data, auth: true})
  },

  async updateNote(slug, data) {
    return request(`/notes/${encodeURIComponent(slug)}`, {method: 'PUT', body: data, auth: true})
  },

  async deleteNote(slug) {
    return request(`/notes/${encodeURIComponent(slug)}`, {method: 'DELETE', auth: true})
  },

  // ---- 站点设置 ----
  async getSettings() {
    return request('/settings')
  },

  async saveSettings(data) {
    return request('/settings', {method: 'PUT', body: data, auth: true})
  },

  // ---- 重置演示数据（本地开发用：删掉浏览器里的旧 token）----
  async resetDemoData() {
    localStorage.removeItem(TOKEN_KEY)
    return {ok: true}
  },
}
