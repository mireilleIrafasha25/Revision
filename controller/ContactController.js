import contactModel from "../model/ContactModel.js";
import { sendEmail } from "../util/sendEmail.js";
import asyncWrapper from "../middleware/async.js";
import {BadRequestError,NotfoundError} from "../error/index.js";
import { UnauthorizedError } from "../error/unauthorizedError.js";
import{validationResult} from "express-validator";
import dotenv from "dotenv"
dotenv.config();
