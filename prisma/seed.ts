import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await hash('password123', 12); // Password Anda
  const admin = await prisma.user.upsert({
    where: { email: 'admin@akash.com' },
    update: {},
    create: {
      email: 'admin@akash.com',
      name: 'Admin Akash',
      password: password,
    },
  });
  console.log('Admin berhasil dibuat:', admin);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => { prisma.$disconnect(); });