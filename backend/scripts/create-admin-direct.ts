import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const username = process.argv[2] || 'admin'
  const password = process.argv[3] || 'admin123'

  console.log(`创建管理员: ${username}`)

  const hashed = await bcrypt.hash(password, 12)

  const existing = await prisma.user.findUnique({ where: { username } })
  if (existing) {
    await prisma.user.update({
      where: { username },
      data: { password: hashed },
    })
    console.log('✅ 密码已更新')
  } else {
    await prisma.user.create({
      data: { username, password: hashed, role: 'admin' },
    })
    console.log('✅ 管理员创建成功')
  }

  console.log(`用户名: ${username} / 密码: ${password}`)
  await prisma.$disconnect()
}

main().catch((e) => { console.error(e); process.exit(1) })
