module.exports = {
  environment: 'dev',
  database: {
    dbName: 'blog',
    host: '118.25.83.243',
    port: 3306,
    user: 'root',
    password: 'Yangjun2506!'
  },
  security: {
    secretKey: "secretKey",
    // 过期时间 1小时
    expiresIn: 60 * 60
  }
}
