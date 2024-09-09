import {signUp} from "../controller/userController.js";
import{ SignupValidation } from "../util/validation.js"
import express from 'express'
const route=express.Router();
route.post('/signup', SignupValidation,signUp);
export default route;