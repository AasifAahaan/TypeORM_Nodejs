import { Request, Response } from 'express';
import { User } from '../entity/User';
import { AppDataSource } from '../config/data-source';
// import * as kafka from 'kafka-node';

// const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
// const producer = new kafka.Producer(client);

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'typeorm',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

async function connectProducer() {
  await producer.connect();
}
connectProducer();

export class UserController {
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { firstName, lastName, age } = req.body;

      if (!firstName || !lastName || !age) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
      }

      const user = new User();
      user.firstName = firstName;
      user.lastName = lastName;
      user.age = age;

      const userRepository = AppDataSource.getRepository(User);
      await userRepository.save(user);

      res.status(201).json({
        message: 'User has been created successfully!',
        user,
      });
    } catch (error) {
      console.error('Error saving user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.find();

      if (!users || users.length === 0) {
        res.status(404).json({ message: 'No users found' });
        return;
      }

      const message = JSON.stringify({
        type: 'FETCH_USERS',
        payload: {
          users,
          count: users.length,
          timestamp: new Date().toISOString(),
        },
      });

      console.log("MESSAGE : ", { message });

      const kafkaUser = await producer.send({
        topic: 'user-activity',
        messages: [
          {
            value: message,
          },
        ],
      });

      // console.log('Kafka message sent successfully', { kafkaUser });
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id: parseInt(id) });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { firstName, lastName, age } = req.body;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id: parseInt(id) });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.age = age || user.age;

      await userRepository.save(user);

      res.status(200).json({
        message: 'User has been updated successfully!',
        user,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id: parseInt(id) });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      await userRepository.remove(user);

      res.status(200).json({
        message: 'User has been deleted successfully!',
        user,
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
