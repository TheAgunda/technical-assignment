import express, { Express, Request, Response, NextFunction } from "express";
import * as Database from "./database/Database";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { AppConfig } from "./config/Constants";
import APIEndpoint from "./routes/apis";
import path from "path";
/** Database connection */
Database.connect();

const ExpressApp: Express = express();
ExpressApp.use(express.json());
ExpressApp.use(express.urlencoded({ extended: false }));
ExpressApp.use(express.static("public"));
ExpressApp.use(cookieParser());

/** Cors Policy */
const allowedOrigins: Array<string> = ["http://localhost:3000"];
const options: cors.CorsOptions = {
    origin: allowedOrigins,
    exposedHeaders: 'x-auth-token',
    credentials: true,
};

ExpressApp.use(cors(options));
ExpressApp.use(`${AppConfig.API_VERSION}`, APIEndpoint);
ExpressApp.use(`/public`, express.static(path.join(__dirname, "../public")));

/*** This is a simple react component */
ExpressApp.use('/',(request: Request, response: Response, next: NextFunction) => { 
    response.sendFile(__dirname + '/public/index.html');
});
ExpressApp.use((request: Request, response: Response, next: NextFunction) => {
    const error = new Error("404 not found.");
    return response.sendStatus(404);
});

/** An error handling middleware */
ExpressApp.use(function (error: any, request: Request, response: Response, next: NextFunction) {
    return response.status(500).json(error);
});

/** File Uploading Errors. */
ExpressApp.use((err: any, request: Request, response: Response, next: NextFunction) => {
    const statusCode = err.status || 500;
    const errorMessage = err.message || 'Internal Server Error';
    return response.status(statusCode).json({ message: errorMessage })
});




export default ExpressApp;