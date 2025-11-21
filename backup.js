/* eslint-disable */

const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

const projectDir = __dirname
const backupDir = path.join(projectDir, 'backups')

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir)
}

const now = new Date()
const timestamp = now.toISOString().replace(/:/g, '-').replace('T', '_').slice(0, 16)
const folderName = `backup-${timestamp}`
const fullBackupPath = path.join(backupDir, folderName)

const command = `robocopy "${projectDir}" "${fullBackupPath}" /E /XD node_modules .next backups`


exec(command, (error) => {
  if (error) {
    console.error("❌ خطا در بکاپ:", error)
    return
  }
  console.log("✅ بکاپ گرفته شد:", folderName)

  const backups = fs.readdirSync(backupDir).filter(name => name.startsWith('backup-'))
  if (backups.length > 2) {
    const sorted = backups.sort()
    const toDelete = sorted.slice(0, backups.length - 2)
    for (const folder of toDelete) {
      const delPath = path.join(backupDir, folder)
      fs.rmSync(delPath, { recursive: true, force: true })
      console.log("🗑 حذف شد:", folder)
    }
  }
})
