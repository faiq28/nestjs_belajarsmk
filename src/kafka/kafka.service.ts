import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(@Inject('LATIHAN_KAFKA') private kafkaClient: ClientKafka) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async sendMessagewithEmit(topic: string, key: string, payload: any) {
    return this.kafkaClient.emit(topic, {
      key: key,
      value: payload,
    });
  }
}
