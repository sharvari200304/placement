import fs from "fs";
import net from "net";
import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..", "..");
const envPath = path.resolve(__dirname, "..", ".env");

dotenv.config({ path: envPath });

const host = "127.0.0.1";
const port = 27017;
const dbPath = path.join(projectRoot, ".mongodb-data");
const logPath = path.join(projectRoot, ".mongodb-log", "mongod.log");
const defaultMongoBin = "C:\\Program Files\\MongoDB\\Server\\8.0\\bin\\mongod.exe";
const mongoBin = process.env.MONGOD_BIN || defaultMongoBin;
const mongoUri = process.env.MONGODB_URI || "";

if (mongoUri && !mongoUri.includes("localhost") && !mongoUri.includes("127.0.0.1")) {
  console.log("Remote MongoDB URI detected; skipping local MongoDB startup.");
  process.exit(0);
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isPortOpen = () =>
  new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
    socket.setTimeout(1000, () => {
      socket.destroy();
      resolve(false);
    });
  });

const waitForMongo = async () => {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (await isPortOpen()) {
      return true;
    }
    await wait(500);
  }
  return false;
};

if (await isPortOpen()) {
  console.log("Local MongoDB already running on 127.0.0.1:27017");
  process.exit(0);
}

if (!fs.existsSync(mongoBin)) {
  console.error(`MongoDB executable not found: ${mongoBin}`);
  console.error("Install MongoDB Community Server or set MONGOD_BIN to your mongod.exe path.");
  process.exit(1);
}

fs.mkdirSync(dbPath, { recursive: true });
fs.mkdirSync(path.dirname(logPath), { recursive: true });

const child = spawn(
  mongoBin,
  [
    "--dbpath",
    dbPath,
    "--logpath",
    logPath,
    "--logappend",
    "--bind_ip",
    host,
    "--port",
    String(port),
  ],
  {
    detached: true,
    stdio: "ignore",
  }
);

child.unref();

if (!(await waitForMongo())) {
  console.error("MongoDB did not start on 127.0.0.1:27017.");
  console.error(`Check the log file: ${logPath}`);
  process.exit(1);
}

console.log("Started local MongoDB on 127.0.0.1:27017");
