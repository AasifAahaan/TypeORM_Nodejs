import 'reflect-metadata'; // Required by TypeORM
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { AppDataSource } from './config/data-source';
import userRoutes from './routes/userRoutes';
import * as kafka from 'kafka-node';

const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });

const producer = new kafka.Producer(client);

const consumer = new kafka.Consumer(
    client,
    [{ topic: 'user-activity', partition: 0 }],
    { autoCommit: true }
);

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

app.get("/api/get", (req: Request, res: Response) => {
    res.send("Aasif Alvi 1234567890");
})

let allUserActivities: any[] = [];
consumer.on('message', (message) => {
    try {
        const messageValue = message.value instanceof Buffer ? message.value.toString() : message.value;
        console.log({ messageValue })
        //@ts-ignore
        const parsedMessage = JSON.parse(messageValue);
        console.log('Received Kafka message:', { parsedMessage });
        allUserActivities.push(parsedMessage);
    } catch (error) {
        console.error('Error processing Kafka message:', error);
    }
});

consumer.on('error', (err) => {
    console.error('Kafka Consumer Error:', err);
});

producer.on('error', (err: Error) => {
    console.error('Kafka Producer Error:', err);
});

// setInterval(() => {
//     console.log('All User Activities:', allUserActivities);
// }, 2000);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
