import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import consola from 'consola'
import dayjs from 'dayjs'

const POSTS_DIR = './src/content/posts/'
const FILE_EXTENSIONS = ['.md', '.mdx'] as const
const SINGLE_QUOTE_RE = /'/g
const ESCAPED_SINGLE_QUOTE = '\\\''
const TEMPLATE_BODY = 'Write your prose here.'

createPost()

/**
 * Create a new post.
 * Prompts for file metadata and creates a clean post template.
 */
async function createPost(): Promise<void> {
  consola.start('Ready to create a new post!')

  const filename = (await consola.prompt('Enter file name: ', { type: 'text' })).trim()
  if (!filename) {
    consola.error('File name cannot be empty.')
    return
  }

  const titleInput = await consola.prompt('Enter post title: ', { type: 'text', initial: filename })
  const title = titleInput.trim()
  if (!title) {
    consola.error('Title cannot be empty.')
    return
  }

  const extension = await consola.prompt('Select file extension: ', {
    type: 'select',
    options: [...FILE_EXTENSIONS],
  })
  const isDraft = await consola.prompt('Is this a draft?', { type: 'confirm', initial: true })

  const fullPath = path.join(POSTS_DIR, `${filename}${extension}`)
  if (fs.existsSync(fullPath)) {
    consola.error(`File already exists: ${fullPath}`)
    return
  }

  const template = getPostTemplate({
    title,
    pubDate: dayjs().format('YYYY-MM-DD'),
    categories: [],
    draft: isDraft,
    description: '',
  })

  try {
    fs.mkdirSync(path.dirname(fullPath), { recursive: true })
    fs.writeFileSync(fullPath, template)
    consola.success('New post created successfully!')

    const open = await consola.prompt('Open the new post?', { type: 'confirm', initial: true })
    if (open) {
      consola.info(`Opening ${fullPath}...`)
      execSync(`code "${fullPath}"`)
    }
  }
  catch (error) {
    consola.error((error as Error).message || 'Failed to create new post!')
  }
}

function toInlineArray(values: string[]): string {
  if (values.length === 0)
    return '[]'

  return `[${values.map(value => `'${escapeYamlString(value)}'`).join(', ')}]`
}

function escapeYamlString(value: string): string {
  return value.replace(SINGLE_QUOTE_RE, ESCAPED_SINGLE_QUOTE)
}

function getPostTemplate(data: {
  title: string
  pubDate: string
  categories: string[]
  draft: boolean
  description: string
}): string {
  return [
    '---',
    `title: '${escapeYamlString(data.title)}'`,
    `pubDate: ${data.pubDate}`,
    `categories: ${toInlineArray(data.categories)}`,
    `draft: ${data.draft}`,
    `description: '${escapeYamlString(data.description)}'`,
    '---',
    '',
    TEMPLATE_BODY,
    '',
  ].join('\n')
}
