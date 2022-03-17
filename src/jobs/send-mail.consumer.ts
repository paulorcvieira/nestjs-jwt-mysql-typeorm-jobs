import { MailerService } from "@nestjs-modules/mailer";
import { OnQueueActive, OnQueueCompleted, OnQueueProgress, Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { CreateUserDTO } from "src/app/users/dtos/create-user.dto";


@Processor('sendMail-queue')
export class SendMailConsumer {
  constructor(private readonly mailService: MailerService) { }

  @Process('sendMail-job')
  async sendMailJob(job: Job<CreateUserDTO>) {
    const { data } = job;

    await this.mailService.sendMail({
      to: data.email,
      subject: 'Madrugueira | Seja bem vindo(a)!',
      text: `Olá ${data.firstName} ${data.lastName}!

      Seu cadastro foi realizado com sucesso.

      Seja bem vindo(a)!

      Att. Equipe Madrugueira`
    });
  }

  @OnQueueActive()
  onQueueActive(job: Job) {
    console.log(`On Active ${job.name}`);
  }

  @OnQueueProgress()
  onQueueProgress(job: Job) {
    console.log(`On Progress ${job.name}`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(`On Completed ${job.name}`);
  }
}
