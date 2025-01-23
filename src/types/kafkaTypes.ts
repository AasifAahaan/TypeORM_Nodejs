export interface KafkaMessage {
    topic: string;
    partition: number;
    message: {
        value: string | Buffer;
        key?: string | Buffer;
        headers?: Record<string, string>;
    };
}

export interface MessagePayload {
    type: string;
    payload: {
        users: { id: number; firstName: string; lastName: string; age: number }[];
        count: number;
        timestamp: string;
    };
}