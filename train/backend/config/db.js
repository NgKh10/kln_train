const sql = require('mssql');

const config = {
  user: 'sa',
  password: '12345678',
  server: process.env.DB_SERVER || 'NGOCKHUE_10',
  database: process.env.DB_DATABASE || 'KLN_Train',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    trustedConnection: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

pool.on('error', err => {
  console.error('❌ Database error:', err.message);
});

async function executeQuery(query, params = {}) {
  try {
    await poolConnect;
    const request = pool.request();
    
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value === undefined || value === null) {
        request.input(key, sql.NVarChar, null);
      } else if (typeof value === 'number') {
        request.input(key, sql.Int, value);
      } else if (value instanceof Date) {
        request.input(key, sql.DateTime, value);
      } else {
        request.input(key, sql.NVarChar, value);
      }
    });
    
    return await request.query(query);
  } catch (err) {
    console.error('Query error:', err);
    throw err;
  }
}

async function executeProcedure(procedureName, params = {}) {
  try {
    await poolConnect;
    const request = pool.request();
    
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value === undefined || value === null) {
        request.input(key, sql.NVarChar, null);
      } else if (typeof value === 'number') {
        request.input(key, sql.Int, value);
      } else {
        request.input(key, sql.NVarChar, value);
      }
    });
    
    return await request.execute(procedureName);
  } catch (err) {
    console.error(`Procedure ${procedureName} error:`, err);
    throw err;
  }
}

module.exports = { executeQuery, executeProcedure, pool };