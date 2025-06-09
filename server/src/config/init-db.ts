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
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
    );
    console.log(`Database ${process.env.DB_NAME} created or already exists`);
    await connection.query(`USE \`${process.env.DB_NAME}\``);

    // Run main initialization script
    const sqlFilePath = path.join(__dirname, "init-db.sql");
    const sqlScript = fs.readFileSync(sqlFilePath, "utf8");
    console.log("SQL Script loaded:", sqlFilePath);
    await connection.query(sqlScript);
    console.log("Database initialized successfully");

    // Run migrations
    const migrationsDir = path.join(__dirname, "migrations");
    if (fs.existsSync(migrationsDir)) {
      const migrationFiles = fs
        .readdirSync(migrationsDir)
        .filter((file) => file.endsWith(".sql"))
        .sort();

      for (const file of migrationFiles) {
        console.log(`Running migration: ${file}`);
        const migrationPath = path.join(migrationsDir, file);
        const migrationScript = fs.readFileSync(migrationPath, "utf8");
        await connection.query(migrationScript);
        console.log(`Migration ${file} completed successfully`);
      }
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, "../../public/uploads");
    if (!fs.existsSync(uploadsDir)) {
      console.log("Creating uploads directory...");
      fs.mkdirSync(uploadsDir, { recursive: true });
      // Set permissions to 755
      fs.chmodSync(uploadsDir, "755");
    }
    console.log("Uploads directory path:", uploadsDir);

    // Create public directory if it doesn't exist
    const publicDir = path.join(__dirname, "../../public");
    if (!fs.existsSync(publicDir)) {
      console.log("Creating public directory...");
      fs.mkdirSync(publicDir, { recursive: true });
      // Set permissions to 755
      fs.chmodSync(publicDir, "755");
    }
    console.log("Public directory path:", publicDir);
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
