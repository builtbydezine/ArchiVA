const config = {
    server: {
        port: process.env.PORT || 3000
    },
    db: {
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'archive_node_database'
    },
    payments: {
        API_KEY: 'test_3a2e55e379de9d108a71ea03b6e',
        AUTH_KEY: 'test_f5ef7eb13440d43ae2b6f267618',
        REDIRECT_URL: 'https://20a1e146-c38c-49d8-86e5-56138fff401c.mock.pstmn.io/success',
        WEBHOOK_URL: 'https://20a1e146-c38c-49d8-86e5-56138fff401c.mock.pstmn.io/paymentSuccess',
        SALT_KEY: '8cd986ac9dec45be8aa292e0582cdc2f'
    },
    session: {
        secretKey: 'super-secret-key',
        secretCookie: 'super-secret-cookie'
    }
}

module.exports = config;