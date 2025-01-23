import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'typeorm',
    brokers: ['localhost:9092'],
});

const admin = kafka.admin();

async function deleteTopic(topicName: string) {
    try {
        await admin.connect();
        console.log(`Connected to Kafka broker...`);

        await admin.deleteTopics({
            topics: [topicName],
            timeout: 3000,
        });

        console.log(`Topic "${topicName}" deleted successfully.`);
    } catch (error) {
        console.error(`Failed to delete topic "${topicName}":`, error);
    } finally {
        await admin.disconnect();
        console.log(`Disconnected from Kafka broker.`);
    }
}

export default deleteTopic;


