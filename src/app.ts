import express, { Application, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import bodyParser from "body-parser";
import router from "./app/routes";
import GlobalErrorHandler from "./app/middlewares/globalErrorHandler";
import { AppBodyTemplate } from "./utils/BodyTemplate";
import morgan from "morgan";
// import { subscriptionController } from "./app/modules/Subscription/Subscription.controller";

const app: Application = express();

export const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://www.corverapro.com",
    "https://corverapro.com",
  ],

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  credentials: true,
};

// Middleware setup
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "20mb" }));
app.use(express.static("public"));
app.use(morgan("dev"));
// Route handler for the root endpoint
app.get("/", (req: Request, res: Response) => {
  res.send(
    AppBodyTemplate({
      message: "Welcome to akarimianpour (corevera) Project API 🚀",
      version: "1.0.1",
      status: "Active",
      repoUrl: "",
      docsUrl: "https://github.com/Kj-RahiL",
      showButtons: true,
    })
  );
});

// app.use("/uploads", express.static(path.join("/var/www/uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"))); // Serve static files from the "uploads" directory

// Setup API routes
app.use("/api/v1", router);

// Error handling middleware
app.use(GlobalErrorHandler);

// 404 Not Found handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});


export default app;
