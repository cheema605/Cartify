import sql from 'mssql';
import { config } from './sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  try {
    // Connect to master database first
    const masterConfig = { ...config, database: 'master' };
    const pool = await sql.connect(masterConfig);
    
    console.log('✅ Connected to SQL Server');

    // Create database if it doesn't exist
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = '${config.database}')
      BEGIN
        CREATE DATABASE ${config.database}
      END
    `);
    
    console.log(`✅ Database ${config.database} is ready`);

    // Switch to the new database
    await pool.request().query(`USE ${config.database}`);

    // Read and execute the cartify scripts
    const scriptPath = path.join(__dirname, '../../cartify_scripts.sql');
    const script = fs.readFileSync(scriptPath, 'utf8');
    
    // Split the script into individual statements
    const statements = script
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    // Execute each statement
    for (const statement of statements) {
      try {
        await pool.request().query(statement);
        console.log('✅ Executed SQL statement successfully');
      } catch (err) {
        console.error('❌ Error executing statement:', err.message);
        console.log('Statement:', statement);
      }
    }

    console.log('✅ Database initialization completed');
    await pool.close();
  } catch (err) {
    console.error('❌ Database initialization failed:', err);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase(); 