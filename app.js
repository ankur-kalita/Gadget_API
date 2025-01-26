require('dotenv').config({ path: `${process.cwd()}/.env` });
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');

const authRouter = require('./route/authRoute');
const gadgetRouter = require('./route/gadgetRoute'); 
const userRouter = require('./route/userRoute');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

const DB = require("./db")

const app = express();

app.use(express.json());

DB().sequelize.sync({alter: true}).then(() => {

    DB().sequelize
  .authenticate()
  .then(() => console.log("Database connected!"))
  .catch((error) => console.error("Unable to connect to the database:", error));
    app.listen(process.env.APP_PORT, () => {
        console.log('====================================');
        console.log("App Started!");
        console.log('====================================');
    })
})

const swaggerDocument = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerYaml = require('yaml').parse(swaggerDocument);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerYaml));


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/gadgets', gadgetRouter);
app.use('/api/v1/users', userRouter);


const PORT = process.env.APP_PORT || 4000;