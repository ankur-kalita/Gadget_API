require('dotenv').config({ path: `${process.cwd()}/.env` });
const express = require('express');

const authRouter = require('./route/authRoute');
const gadgetRouter = require('./route/gadgetRoute'); 
const userRouter = require('./route/userRoute');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

const app = express();

app.use(express.json());


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/gadgets', gadgetRouter);
app.use('/api/v1/users', userRouter);

app.use(
    '*',
    catchAsync(async (req, res, next) => {
        throw new AppError(`Bruh, Can't find ${req.originalUrl} on this server`, 404);
    })
);

app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 4000;

app.listen(PORT, () => {
    console.log('Booyah🎉, Server up and running on port', PORT);
});
