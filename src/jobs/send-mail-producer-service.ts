import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CreateUserDTO } from 'src/app/users/dtos/create-user.dto';

@Injectable()
export class SendMailProducerService {
  constructor(@InjectQueue('sendMail-queue') private queue: Queue) { }

  async sendMail(data: CreateUserDTO) {
    await this.queue.add('sendMail-job', data, {
      delay: 1000,
    });
  }
}
