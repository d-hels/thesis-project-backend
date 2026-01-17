"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
var pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL || "postgres://postgres:postgres@db:5432/employvia_db"
});
exports.default = pool;
//# sourceMappingURL=setup.js.map