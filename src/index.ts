import express, { Request, Response } from "express";
import managerRoutes from "./routes/managerRoutes";
import adminRoutes from "./routes/adminRoutes";
import workerRoutes from "./routes/workerRoutes";
import cors from "cors";
import passport from "passport";
import { strategy } from "./utils/auth";
import "./db/queries/attendanceCron";

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const options: cors.CorsOptions = {
  origin: ["http://localhost:5173"],
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
  allowedHeaders: [
    "Origin",
    "Content-Type",
    "Accept",
    "X-Requested-With",
    "Authorization",
  ],
};
app.use(cors(options));

passport.use(strategy);
app.use(passport.initialize());

app.use("/api/admin", adminRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/worker", workerRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript + Express with ESM!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
