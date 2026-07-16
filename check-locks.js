import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkLocks() {
  console.log('=== VÉRIFICATION DES LOCKS ===\n');
  
  try {
    // Check active connections
    console.log('=== CONNEXIONS ACTIVES ===');
    const connections = await prisma.$queryRaw`
      SELECT pid, usename, application_name, state, query_start, state_change
      FROM pg_stat_activity
      WHERE datname = current_database()
      ORDER BY state_change DESC
    `;
    
    for (const conn of connections) {
      console.log(`PID: ${conn.pid}, User: ${conn.usename}, App: ${conn.application_name}, State: ${conn.state}`);
    }
    
    // Check locks
    console.log('\n=== LOCKS ACTIFS ===');
    const locks = await prisma.$queryRaw`
      SELECT l.locktype, l.mode, l.granted, l.relation::regclass AS table
      FROM pg_locks l
      JOIN pg_database d ON l.database = d.oid
      WHERE d.datname = current_database()
      AND NOT l.granted
      ORDER BY l.locktype, l.mode
    `;
    
    if (locks.length === 0) {
      console.log('Aucun lock en attente');
    } else {
      for (const lock of locks) {
        console.log(`Type: ${lock.locktype}, Mode: ${lock.mode}, Granted: ${lock.granted}, Table: ${lock.table}`);
      }
    }
    
    // Check blocked queries
    console.log('\n=== REQUÊTES BLOQUÉES ===');
    const blocked = await prisma.$queryRaw`
      SELECT pid, usename, state, query_start, wait_event_type, wait_event
      FROM pg_stat_activity
      WHERE state = 'active'
      AND wait_event_type IS NOT NULL
      ORDER BY query_start
    `;
    
    if (blocked.length === 0) {
      console.log('Aucune requête bloquée');
    } else {
      for (const q of blocked) {
        console.log(`PID: ${q.pid}, User: ${q.usename}, Wait: ${q.wait_event_type} - ${q.wait_event}`);
      }
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  await prisma.$disconnect();
}

checkLocks();
