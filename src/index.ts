import 'reflect-metadata'; // Required by TypeORM
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { AppDataSource } from './config/data-source';
import userRoutes from './routes/userRoutes';

const app = express();
const port = 3000;

app.use(bodyParser.json());

AppDataSource.initialize()
    .then(() => {
        console.log('🔌 Data Source has been initialized! 🎉');
    })
    .catch((error: any) => {
        console.error('❌ Error during Data Source initialization:', error);
    });

app.use('/api', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
