import express from "express";
import mongoose from "mongoose"
import router from "./route/index.js"
import dotenv from "dotenv"
import errorHandler from "./middleware/errorHandler.js"
import documentation from "./doc/swagger.json" assert{type:"json"}
import swaggerUi from "swagger-ui-express" 
const app=express();
//time seconds
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // 30 seconds timeout
    socketTimeoutMS: 45000, // 45 seconds timeout
    maxPoolSize: 10, // Maintain up to 10 socket connections
  };
dotenv.config();
app.use(express.json());
app.use("/api_docs",swaggerUi.serve,swaggerUi.setup(documentation))
app.use("/weeding",router)
mongoose.connect(`${process.env.db}`,options)
.then(()=>
{
    console.log("connected to database");

})
.catch(err=>
{
    console.log(err)
}
)
app.listen(process.env.PORT,()=>
{
    console.log(`Server is running on port ${process.env.PORT}`);
 
})
app.use(errorHandler)