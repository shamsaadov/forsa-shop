import fs from "fs";
import path from "path";
import { config } from "dotenv";
import mysql from "mysql2/promise";

config({ path: path.resolve(__dirname, "../../.env") });

console.log("DB Config:", {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const initDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true, // Разрешить множественные запросы
  });
  try {
    console.log("Initializing database...");
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``,
    );
    console.log(`Database ${process.env.DB_NAME} created or already exists`);
    await connection.query(`USE \`${process.env.DB_NAME}\``);

    const sqlFilePath = path.join(__dirname, "init-db.sql");
    const sqlScript = fs.readFileSync(sqlFilePath, "utf8");
    console.log("SQL Script loaded:", sqlFilePath);

    // Выполняем весь скрипт целиком
    await connection.query(sqlScript);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

if (require.main === module) {
  initDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Failed to initialize database:", error);
      process.exit(1);
    });
}

export default initDatabase;
