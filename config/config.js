module.exports = {
    mysql_config: {
        "host": "localhost",
        "username": "root" || process.env.MYSQL_USER,
        "password": process.env.MYSQL_PASSWORD || "",
        "connection-limit": 20,
        "database": "order_management"
    },
    mongo_config: {
        'db_host': 'mongodb://127.0.0.1/',
        'db_name': 'order_management'
    }
}
