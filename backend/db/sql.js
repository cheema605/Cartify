import sql from 'mssql/msnodesqlv8.js';

console.log('DB_SERVER:', process.env.DB_SERVER);
console.log('DB_DATABASE:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);

const config = {
  connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_NAME};Uid=${process.env.DB_USER};Pwd=${process.env.DB_PASSWORD};`
};


// Connection pool
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Connected to SQL Server using Windows Auth (msnodesqlv8)');
    return pool;
  })
  .catch(err => {
    console.error('❌ SQL Server Connection Failed:', err);
    process.exit(1);
  });

// Optional direct connection function
const connectToDatabase = async () => {
  try {
    const pool = await sql.connect(config);
    console.log('✅ Manual DB connection established');
    return pool;
  } catch (err) {
    console.error('❌ Manual DB connection failed:', err);
    throw err;
  }
};

// ✅ Export everything you need
export { sql, poolPromise, connectToDatabase };
