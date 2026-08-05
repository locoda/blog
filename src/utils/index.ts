import type { Post } from '~/types'
import { getCollection } from 'astro:content'
import dayjs from 'dayjs'
import MarkdownIt from 'markdown-it'
import sanitizeHtml from 'sanitize-html'

export async function getCategories() {
  const posts = await getPosts()
  const categories = new Map<string, Post[]>()

  for (const post of posts) {
    if (post.data.categories) {
      for (const c of post.data.categories) {
        const posts = categories.get(c) || []
        posts.push(post)
        categories.set(c, posts)
      }
    }
  }

  return categories
}

export async function getPosts(isArchivePage = false) {
  const posts = await getCollection('posts')

  posts.sort((a, b) => {
    if (isArchivePage) {
      return dayjs(a.data.pubDate).isBefore(dayjs(b.data.pubDate)) ? 1 : -1
    }

    const aDate = a.data.modDate ? dayjs(a.data.modDate) : dayjs(a.data.pubDate)
    const bDate = b.data.modDate ? dayjs(b.data.modDate) : dayjs(b.data.pubDate)

    return aDate.isBefore(bDate) ? 1 : -1
  })

  if (import.meta.env.PROD) {
    return posts.filter(post => post.data.draft !== true)
  }

  return posts
}

const parser = new MarkdownIt()
export function getPostDescription(post: Post) {
  if (post.data.description) {
    return post.data.description
  }

  const html = parser.render(post.body || '')
  const sanitized = sanitizeHtml(html, { allowedTags: [] })
  return sanitized.slice(0, 400)
}

export function formatDate(date: Date, format: string = 'YYYY-MM-DD') {
  return dayjs(date).format(format)
}

export function getPathFromCategory(
  category: string,
  category_map: { name: string, path: string }[],
) {
  const mappingPath = category_map.find(l => l.name === category)
  return mappingPath ? mappingPath.path : category
}

export function getPostUrl(postId: string) {
  return `/posts/${postId}/`
}

/**
 * Splits a serial number off the front of a title so it can be set apart
 * typographically — `Vol.34/ 痕迹` becomes `Vol.34` + `痕迹`.
 *
 * The separator has to be a slash followed by whitespace, and the serial has
 * to contain a digit. Both conditions are needed: a title like
 * `关于日剧下载/转写/机翻的工具介绍` uses slashes as ordinary punctuation and
 * must come through untouched.
 */
export function splitPostTitle(title: string) {
  const plain = { serial: null, name: title }

  const slash = title.indexOf('/')
  if (slash === -1)
    return plain

  const serial = title.slice(0, slash)
  const rest = title.slice(slash + 1)
  const name = rest.trimStart()

  // `name === rest` means nothing was trimmed, so the slash was not followed
  // by whitespace and is ordinary punctuation rather than a separator.
  if (name === rest || name === '' || !/\d/.test(serial))
    return plain

  return { serial, name }
}
