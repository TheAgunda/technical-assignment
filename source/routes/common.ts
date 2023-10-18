import express, { Router } from "express";
import CommonController from "../controllers/CommonController";
const CommonEndpoint: Router = express.Router();
CommonEndpoint.get('/courses', CommonController.index);
CommonEndpoint.get('/filters', CommonController.filters);
export = CommonEndpoint;