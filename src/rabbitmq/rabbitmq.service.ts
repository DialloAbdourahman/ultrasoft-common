// src/rabbitmq/rabbitmq.service.ts
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import * as amqp from "amqplib";

export interface ListenerOptions {
  exchange: string;
  queue: string;
  routingKeys: string[];
  onMessage: (routingKey: string, data: any) => Promise<void>;
}

export interface PublishOptions<T> {
  exchange: string;
  routingKey: string;
  message: T;
}

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: amqp.ChannelModel | null = null;
  private publishChannel: amqp.Channel | null = null;

  constructor(private readonly rabbitmqUrl: string) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  // ─── Connection ───────────────────────────────────────────
  private async connect() {
    try {
      this.connection = await amqp.connect(this.rabbitmqUrl);
      this.publishChannel = await this.connection.createChannel();
      this.logger.log("Connected to RabbitMQ");

      this.connection.on("error", (err) => {
        this.logger.error("RabbitMQ connection error", err.message);
      });

      this.connection.on("close", () => {
        this.logger.warn("RabbitMQ connection closed — reconnecting in 5s");
        setTimeout(() => this.connect(), 5000);
      });
    } catch (error: any) {
      this.logger.error("Failed to connect to RabbitMQ", error.message);
      setTimeout(() => this.connect(), 5000);
    }
  }

  private async disconnect() {
    try {
      await this.publishChannel?.close();
      await this.connection?.close();
    } catch (err) {
      this.logger.error("Error disconnecting from RabbitMQ", err);
    }
  }

  // ─── Publisher ────────────────────────────────────────────
  async publish<T>({ exchange, routingKey, message }: PublishOptions<T>) {
    try {
      if (!this.publishChannel) throw new Error("Publish channel not ready");

      await this.publishChannel.assertExchange(exchange, "topic", {
        durable: true,
      });

      const buffer = Buffer.from(JSON.stringify(message));
      const published = this.publishChannel.publish(
        exchange,
        routingKey,
        buffer,
        {
          persistent: true, // survive broker restart
        },
      );

      if (published) {
        this.logger.log(
          `[PUBLISH] exchange=${exchange} routingKey=${routingKey}`,
        );
      } else {
        this.logger.warn(
          `[PUBLISH FAILED] exchange=${exchange} routingKey=${routingKey}`,
        );
      }
    } catch (error: any) {
      this.logger.error(`[PUBLISH ERROR] ${error.message}`);
      throw error;
    }
  }

  // ─── Listener ─────────────────────────────────────────────
  async listen({ exchange, queue, routingKeys, onMessage }: ListenerOptions) {
    try {
      if (!this.connection) throw new Error("Connection not ready");

      const channel = await this.connection.createChannel();
      const dlq = `${queue}.dlq`;

      // Assert exchange
      await channel.assertExchange(exchange, "topic", { durable: true });

      // Assert DLQ
      await channel.assertQueue(dlq, { durable: true });

      // Assert main queue with DLQ routing
      await channel.assertQueue(queue, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": exchange,
          "x-dead-letter-routing-key": `${queue}.dlq`,
        },
      });

      // Bind routing keys
      for (const key of routingKeys) {
        await channel.bindQueue(queue, exchange, key);
      }

      // Bind DLQ
      await channel.bindQueue(dlq, exchange, `${queue}.dlq`);

      this.logger.log(
        `[LISTENING] queue=${queue} keys=[${routingKeys.join(", ")}]`,
      );

      // Consume messages
      await channel.consume(
        queue,
        async (msg) => {
          if (!msg) return;

          const routingKey = msg.fields.routingKey;
          const headers = msg.properties?.headers ?? {};
          const retryCount = (headers["x-retry-count"] as number) ?? 0;

          try {
            const data = JSON.parse(msg.content.toString());
            this.logger.log(`[RECEIVED] routingKey=${routingKey}`);
            await onMessage(routingKey, data);
            channel.ack(msg);
          } catch (err: any) {
            this.logger.error(
              `[FAILED] routingKey=${routingKey} error=${err.message}`,
            );

            if (retryCount < 3) {
              this.logger.warn(
                `[RETRY] attempt=${retryCount + 1}/3 routingKey=${routingKey}`,
              );
              channel.publish(exchange, routingKey, msg.content, {
                headers: { "x-retry-count": retryCount + 1 },
              });
              channel.ack(msg);
            } else {
              this.logger.error(
                `[DLQ] Moving to DLQ after 3 attempts routingKey=${routingKey}`,
              );
              channel.nack(msg, false, false); // 👈 sends to DLQ automatically
            }
          }
        },
        { noAck: false },
      );
    } catch (error: any) {
      this.logger.error(`[LISTEN ERROR] ${error.message}`);
      throw error;
    }
  }
}
