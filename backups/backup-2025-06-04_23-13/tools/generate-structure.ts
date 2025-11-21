// tools/generate-structure.ts

import { readdirSync, statSync, writeFileSync } from "fs"
import { join } from "path"

function walk(dir = ".", prefix = ""): string {
  let output = ""
  for (const file of readdirSync(dir)) {
    const fullPath = join(dir, file)
    const isDir = statSync(fullPath).isDirectory()
    output += prefix + "├── " + file + (isDir ? "/\n" : "\n")
    if (isDir) output += walk(fullPath, prefix + "│   ")
  }
  return output
}

const tree = walk(".") // ⬅️ کل پروژه
writeFileSync("project-structure.txt", tree)
console.log("✅ فایل project-structure.txt ساخته شد.")
