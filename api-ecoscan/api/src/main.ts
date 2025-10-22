import "./config/env";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { Connection } from "./database/connection";
import { setupDatabase } from "./database/dbSetup";
import { errorHandler } from "./errors/handler.error";
import { routes } from "./routes";

const app = express();

await Connection();
await setupDatabase();

const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://10.130.166.199:5173',
    'http://192.168.1.12:5173',
    'http://10.116.231.199:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

 app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use(cookieParser());


app.use(routes);

app.use(errorHandler);

app.listen(3000, '0.0.0.0',  () => console.log("Servidor Ligado na porta 3000"));