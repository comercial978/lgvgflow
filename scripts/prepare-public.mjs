import { cp, mkdir, rm, copyFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')

await mkdir(publicDir, { recursive: true })

for (const directory of ['assets', 'download', 'manual']) {
  const destination = path.join(publicDir, directory)
  await rm(destination, { recursive: true, force: true })
  await cp(path.join(root, directory), destination, { recursive: true })
}

await mkdir(path.join(publicDir, 'data'), { recursive: true })
await copyFile(
  path.join(root, 'data', 'market-news.json'),
  path.join(publicDir, 'data', 'market-news.json'),
)

for (const file of ['CNAME', 'site.webmanifest']) {
  await copyFile(path.join(root, file), path.join(publicDir, file))
}

console.log('Public assets prepared.')
