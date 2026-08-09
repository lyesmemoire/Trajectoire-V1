/**
 * Install pgvector extension
 * Required for vector columns in GraphNode table
 */

import { PrismaClient } from '@prisma/client';

async function installVectorExtension() {
  const prisma = new PrismaClient();

  try {
    console.log('=== INSTALLING PGVECTOR EXTENSION ===\n');
    
    // Check if vector extension is available
    const availableExtensions = await prisma.$queryRaw`
      SELECT name, default_version, installed_version
      FROM pg_available_extensions
      WHERE name = 'vector'
    `;
    console.log('Available vector extension:', availableExtensions);
    
    if (!availableExtensions || !Array.isArray(availableExtensions) || availableExtensions.length === 0) {
      console.log('❌ vector extension is NOT available in this database');
      console.log('STOP: Cannot proceed without vector extension');
      throw new Error('vector extension not available');
    }
    
    console.log('✅ vector extension is available');
    
    // Install vector extension
    console.log('\nInstalling vector extension...');
    await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS vector`);
    console.log('✅ vector extension installed');
    
    // Verify installation
    const installedExtensions = await prisma.$queryRaw`
      SELECT extname, extversion
      FROM pg_extension
      WHERE extname = 'vector'
    `;
    console.log('\nInstalled vector extension:', installedExtensions);
    
    if (!installedExtensions || !Array.isArray(installedExtensions) || installedExtensions.length === 0) {
      console.log('❌ vector extension installation failed');
      throw new Error('vector extension installation failed');
    }
    
    console.log('\n✅ Vector extension installation complete');
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

installVectorExtension();
