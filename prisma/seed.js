// database seed file, **** UPDATE FOR NEW ENTIES *********
import { PrismaClient } from '../src/generated/prisma/index.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.clubAnnouncement.deleteMany();
  await prisma.clubMembership.deleteMany();
  await prisma.club.deleteMany();
  await prisma.user.deleteMany();

  // Hash password for all users (using 'password123' as default)
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create API Admins
  const apiAdmins = await Promise.all([
    prisma.user.create({
      data: {
        email: 'norm@uncc.edu',
        password: hashedPassword,
        name: 'Norm',
        role: 'API_ADMIN',
      },
    }),
    prisma.user.create({
      data: {
        email: 'nick@uncc.edu',
        password: hashedPassword,
        name: 'Nick',
        role: 'API_ADMIN',
      },
    }),
    prisma.user.create({
      data: {
        email: 'heidi@uncc.edu',
        password: hashedPassword,
        name: 'Heidi',
        role: 'API_ADMIN',
      },
    }),
  ]);

  console.log('✓ Created API Admins:', apiAdmins.map(u => u.name).join(', '));

  // Create Club Members
  const clubMembers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'nicholas@uncc.edu',
        password: hashedPassword,
        name: 'Nicholas',
        role: 'CLUB_MEMBER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'moses@uncc.edu',
        password: hashedPassword,
        name: 'Moses',
        role: 'CLUB_MEMBER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'dante@uncc.edu',
        password: hashedPassword,
        name: 'Dante',
        role: 'CLUB_MEMBER',
      },
    }),
  ]);

  console.log('✓ Created Club Members:', clubMembers.map(u => u.name).join(', '));

  // Create Clubs (using first API admin as the admin for all clubs initially)
  const clubs = await Promise.all([
    prisma.club.create({
      data: {
        name: 'UNCC_Skateboarding',
        description: 'Skateboarding club for all skill levels at UNC Charlotte',
        adminId: apiAdmins[0].id,
      },
    }),
    prisma.club.create({
      data: {
        name: '49th Security Division',
        description: 'Cybersecurity and information security club',
        adminId: apiAdmins[1].id,
      },
    }),
    prisma.club.create({
      data: {
        name: '49er Drone Club',
        description: 'Drone enthusiasts and aerial photography club',
        adminId: apiAdmins[2].id,
      },
    }),
    prisma.club.create({
      data: {
        name: 'Archery',
        description: 'Traditional and modern archery club',
        adminId: apiAdmins[0].id,
      },
    }),
  ]);

  console.log('✓ Created Clubs:', clubs.map(c => c.name).join(', '));

  // Add some club memberships as examples
  await Promise.all([
    // Nicholas joins UNCC_Skateboarding and Archery
    prisma.clubMembership.create({
      data: {
        userId: clubMembers[0].id,
        clubId: clubs[0].id,
      },
    }),
    prisma.clubMembership.create({
      data: {
        userId: clubMembers[0].id,
        clubId: clubs[3].id,
      },
    }),
    // Moses joins 49th Security Division
    prisma.clubMembership.create({
      data: {
        userId: clubMembers[1].id,
        clubId: clubs[1].id,
      },
    }),
    // Dante joins 49er Drone Club
    prisma.clubMembership.create({
      data: {
        userId: clubMembers[2].id,
        clubId: clubs[2].id,
      },
    }),
  ]);

  console.log('✓ Created sample club memberships');

  // Create some sample announcements
  await Promise.all([
    prisma.clubAnnouncement.create({
      data: {
        clubId: clubs[0].id,
        title: 'Welcome to UNCC Skateboarding!',
        content: 'Join us every Friday at 4 PM at the campus skate park.',
      },
    }),
    prisma.clubAnnouncement.create({
      data: {
        clubId: clubs[1].id,
        title: 'Security Workshop This Week',
        content: 'Learn about ethical hacking and penetration testing.',
      },
    }),
  ]);

  console.log('✓ Created sample announcements');
  console.log('\nSeed completed successfully!');
  console.log('\nDefault credentials for all users:');
  console.log('Password: password123');
  console.log('\nAPI Admins:');
  apiAdmins.forEach(admin => console.log(`  - ${admin.email}`));
  console.log('\nClub Members:');
  clubMembers.forEach(member => console.log(`  - ${member.email}`));
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });