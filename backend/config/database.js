const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,

    connectionString:
        `Driver={${process.env.DB_DRIVER}};` +
        `Server=${process.env.DB_SERVER};` +
        `Database=${process.env.DB_DATABASE};` +
        'Trusted_Connection=Yes;' +
        'Encrypt=Yes;' +
        `TrustServerCertificate=${process.env.DB_TRUST_CERTIFICATE};`,

    connectionTimeout: 15000,
    requestTimeout: 15000,

    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

const pool = new sql.ConnectionPool(config);

pool.on('error', (error) => {
    console.error('Error de SQL Server:', error.message);
});

async function conectarBD() {
    if (!pool.connected) {
        await pool.connect();
        console.log('Conexion exitosa a SQL Server');
        console.log('Base de datos:', process.env.DB_DATABASE);
    }

    return pool;
}

module.exports = {
    sql,
    conectarBD
};