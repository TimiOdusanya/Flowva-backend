import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./db/db";
import logger from "./lib/log/winston.log";
import httpLogger from "./lib/log/morgan.log";

// Routes
import authRoutes from "./modules/user/routes";



dotenv.config();

const app = express();

const allowedOrigins: string[] = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://flowva-frontend.vercel.app",
];

app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(httpLogger);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from server" });
});

console.log("Starting server...");

app.use("/api/v1/auth", authRoutes);

const port = process.env.PORT || 8081;

app.listen(port, async () => {
  logger.info(`App running on port ${port}.....`);
  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection failed. Exiting...");
    process.exit(1);
  }
});


process.on("uncaughtException", (err: Error) => {
  console.error("There was an uncaught error", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason: unknown, promise: Promise<any>) => {
  console.error("Unhandled rejection at:", promise, "reason:", reason);
});
