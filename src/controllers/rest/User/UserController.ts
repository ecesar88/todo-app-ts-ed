import { Controller, Inject } from "@tsed/di";
import { Get, Post } from "@tsed/schema";
import { PrismaService } from "../../../services/PrismaService";
import { BodyParams, PathParams } from "@tsed/platform-params";
import { UserModel } from "src/models";

@Controller("/users")
export class UserController {
  @Inject()
  protected prisma: PrismaService;

  @Get("/")
  async get() {
    const users = await this.prisma.user.findMany();

    return users;
  }

  @Get("/:id")
  async getOne(@PathParams("id") id: number) {
    const user = await this.prisma.user.findFirst({ where: { id } });
    return user;
  }

  @Post("/")
  async create(@BodyParams() payload: UserModel) {
    const user = await this.prisma.user.create({
      data: payload
    });

    return user;
  }
}
