import express, { Router } from "express";
import CommonEndpoint from "./common";

const APIEndpoint: Router = express.Router();
APIEndpoint.use("/", CommonEndpoint);
export default APIEndpoint;
