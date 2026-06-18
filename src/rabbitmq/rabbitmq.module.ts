// src/rabbitmq/rabbitmq.module.ts
import { DynamicModule, Module } from "@nestjs/common";
import { RabbitMQService } from "./rabbitmq.service";

export interface RabbitMQModuleOptions {
  rabbitmqUrl: string;
}

@Module({})
export class RabbitMQModule {
  static forRoot(options: RabbitMQModuleOptions): DynamicModule {
    return {
      module: RabbitMQModule,
      providers: [
        {
          provide: RabbitMQService,
          useValue: new RabbitMQService(options.rabbitmqUrl),
        },
      ],
      exports: [RabbitMQService],
      global: true,
    };
  }
}
