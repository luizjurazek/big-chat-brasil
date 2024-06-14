import express from "express";
import swaggerUi from "swagger-ui-express";
import * as swaggerFile from "../swagger_output.json";
import ClientRouter from "./routes/clientRouter";
import SMSRouter from "./routes/smsRouter"

const app = express();

// setup for use json on requests
app.use(express.json());
// setup for swagger
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/client", ClientRouter);
app.use("/sms", SMSRouter);

export default app;
