import { PrismaClient } from "@prisma/client";
import { Configuration, Injectable, OnDestroy, OnInit } from "@tsed/di";
import { Logger } from "@tsed/logger";

@Injectable()
export class PrismaService extends PrismaClient implements OnInit, OnDestroy {
  constructor(
    @Configuration() settings: Configuration,
    protected logger: Logger
  ) {
    super(settings.get("prisma"));
  }

  async $onInit(): Promise<void> {
    this.logger.info("Connection to Prisma database");
    await this.$connect();
  }

  async $onDestroy(): Promise<void> {
    this.logger.info("Connection to Prisma database");
    await this.$disconnect();
  }
}
