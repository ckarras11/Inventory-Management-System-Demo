exports.DATABASE_URL = process.env.DATABASE_URL ||
    global.DATABASE_URL ||
    'mongodb://localhost/Inventory-Management-System';

exports.TEST_DATABASE_URL = (
    process.env.TEST_DATABASE_URL ||
    'mongodb://localhost/test-Inventory-Management-System');

exports.PORT = process.env.PORT || 8080;