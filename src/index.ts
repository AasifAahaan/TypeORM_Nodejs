import 'reflect-metadata'; // Required by TypeORM
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { AppDataSource } from './config/data-source';
import userRoutes from './routes/userRoutes';
import { KAFKA_TOPICS } from './config/topics.config';
import { KafkaMessage } from 'kafkajs';
import { MessagePayload } from './types/kafkaTypes';
import { kafkaConsumer } from './helpers/kafka.helper';
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'typeorm',
    brokers: ['localhost:9092'],
});
// const consumer = kafka.consumer({ groupId: 'user-group' });

// async function runConsumer() {
//     try {
//         await consumer.connect();
//         await consumer.subscribe({ topic: 'user-activity', fromBeginning: true });
//         // console.log('Consumer connected and subscribed to topic user-activity');
//         await consumer.run({
//             eachMessage: async ({ topic, partition, message }: { topic: string; partition: number; message: KafkaMessage }) => {
//                 try {
//                     //@ts-ignore
//                     const messageValue: MessagePayload = JSON.parse(message.value.toString());
//                     console.log({ messageValue })
//                     const { users, count, timestamp } = messageValue.payload;

//                     console.log(`\n==================== User Fetch Report ====================`);
//                     console.log(`| Total Users:     ${count}                                    `);
//                     console.log(`| Timestamp:       ${timestamp}                                `);
//                     console.log(`===========================================================\n`);

//                     console.log(`User Details:`);
//                     console.log(`-----------------------------------------------------------`);

//                     users.forEach((user, index) => {
//                         console.log(`| User ${index + 1}:`);
//                         console.log(`|   First Name:    ${user.firstName}`);
//                         console.log(`|   Last Name:     ${user.lastName}`);
//                         console.log(`|   Age:           ${user.age}`);
//                         console.log(`-----------------------------------------------------------`);
//                     });

//                     console.log(`===========================================================\n`);

//                 } catch (error) {
//                     console.error('Error parsing message:', error);
//                 }
//             },
//         });
//     } catch (error) {
//         console.error('Error connecting to Kafka:', error);
//     }
// }

// runConsumer().catch(console.error);

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

const consumerRunner = async () => {
    try {
        for (const topic of KAFKA_TOPICS) {
            console.log("TOPIC : ", { topic })
            await kafkaConsumer(topic);
        }
    }
    catch (error) {
        console.log(error)
    }
}


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    consumerRunner();
});
