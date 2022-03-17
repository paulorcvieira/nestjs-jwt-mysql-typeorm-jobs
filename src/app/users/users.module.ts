import { BullModule, InjectQueue } from '@nestjs/bull';
import { Module, UseGuards } from '@nestjs/common';
import { MiddlewareBuilder } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { createBullBoard } from 'bull-board';
import { BullAdapter } from 'bull-board/bullAdapter';
import { SendMailProducerService } from 'src/jobs/send-mail-producer-service';
import { SendMailConsumer } from 'src/jobs/send-mail.consumer';
import { UsersController } from './users.controller';
import { UsersEntity } from './users.entity';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    BullModule.registerQueue({ name: 'sendMail-queue' }),
  ],
  controllers: [UsersController],
  providers: [UsersService, SendMailProducerService, SendMailConsumer],
  exports: [UsersService],
})


@UseGuards(AuthGuard('jwt'))
export class UsersModule {
  constructor(@InjectQueue('sendMail-queue') private sendEmailQueue: Queue) { }

  configure(consumer: MiddlewareBuilder) {
    const { router } = createBullBoard([new BullAdapter(this.sendEmailQueue)]);
    consumer.apply(router).forRoutes('/api/admin/queues')
  }
}
