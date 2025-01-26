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

const { Sequelize } = require('sequelize');


const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: true, 
    dialectOptions: {
      ssl: {
        require: true, 
        rejectUnauthorized: false, 
      },
    },
    seederStorage: 'sequelize',
  });

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();


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
