import { KafkaMessage } from "kafkajs";
import { MessagePayload } from "../types/kafkaTypes";

const { Kafka } = require("kafkajs");

const kafkaClient = new Kafka({
    clientId: 'typeorm',
    brokers: ['localhost:9092'],
});

export const kafkaConsumer = async (kafka_topic: string) => {
    const consumer = kafkaClient.consumer({ groupId: `typeorm-consumer-${kafka_topic}` });
    console.log(`Consumer connected and subscribed to topic ${kafka_topic}`);
    await consumer.connect();
    await consumer.subscribe({
        topic: kafka_topic,
        fromBeginning: true
    });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }: { topic: string; partition: number; message: KafkaMessage }) => {
            try {
                //@ts-ignore
                const messageValue: MessagePayload = JSON.parse(message.value.toString());
                // console.log({ messageValue });
                const { users, count, timestamp } = messageValue.payload;

                console.log(`\n==================== User Fetch Report ====================`);
                console.log(`| Total Users:     ${count}                                    `);
                console.log(`| Timestamp:       ${timestamp}                                `);
                console.log(`===========================================================\n`);

                console.log(`User Details:`);
                console.log(`-----------------------------------------------------------`);

                users.forEach((user, index) => {
                    console.log(`| User ${index + 1}:`);
                    console.log(`|   First Name:    ${user.firstName}`);
                    console.log(`|   Last Name:     ${user.lastName}`);
                    console.log(`|   Age:           ${user.age}`);
                    console.log(`-----------------------------------------------------------`);
                });

                console.log(`===========================================================\n`);

            } catch (error) {
                console.error('Error parsing message:', error);
            }
        },
    });
}