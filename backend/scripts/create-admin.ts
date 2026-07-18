/**
 * 创建管理员账号脚本
 * 用法: npx ts-node scripts/create-admin.ts
 */
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import * as readline from 'readline'

const prisma = new PrismaClient()

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const ask = (q: string): Promise<string> =>
    new Promise((resolve) => rl.question(q, resolve))

  console.log('=== 创建珠江小智管理员账号 ===\n')

  const username = await ask('用户名 (默认: admin): ') || 'admin'
  const password = await ask('密码 (默认: admin123): ') || 'admin123'
  const email = await ask('邮箱 (可选): ') || ''

  rl.close()

  // 检查是否已存在
  const existing = await prisma.user.findUnique({ where: { username } })
  if (existing) {
    console.log(`\n⚠️  用户 "${username}" 已存在，正在更新密码...`)
    const hashed = await bcrypt.hash(password, 12)
    await prisma.user.update({
      where: { username },
      data: { password: hashed, email: email || undefined },
    })
    console.log('✅ 密码已更新')
  } else {
    const hashed = await bcrypt.hash(password, 12)
    await prisma.user.create({
      data: {
        username,
        password: hashed,
        email: email || null,
        role: 'admin',
      },
    })
    console.log('✅ 管理员账号创建成功')
  }

  console.log(`\n用户名: ${username}`)
  console.log(`密码: ${password}`)
  console.log('\n登录地址: http://localhost:5173/admin/login')

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error('创建失败:', e)
  process.exit(1)
})
