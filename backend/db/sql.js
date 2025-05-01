import sql from 'mssql';

console.log('DB_SERVER:', process.env.DB_SERVER);
console.log('DB_DATABASE:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // important for local development
    trustServerCertificate: true,
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Connected to SQL Server using mssql');
    return pool;
  })
  .catch(err => {
    console.error('❌ SQL Server Connection Failed:', err);
    process.exit(1);
  });

export { sql, poolPromise };
