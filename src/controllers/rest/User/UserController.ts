import { Controller, Inject } from "@tsed/di";
import { PrismaService } from "../../../services/PrismaService";
import { BodyParams, PathParams } from "@tsed/platform-params";
import { UserModel } from "src/models";
import { HttpStatus } from "src/lib/enums/http-status.enum";
import { Delete, Get, Patch, Post, Returns } from "@tsed/schema";

@Controller("/users")
export class UserController {
  @Inject()
  protected prisma: PrismaService;

  @Get("/")
  @Returns(HttpStatus.CREATED, Array).Of(UserModel)
  async get() {
    const users = await this.prisma.user.findMany();

    return users;
  }

  @Get("/:id")
  @Returns(HttpStatus.CREATED, UserModel).Description("Created")
  async getOne(@PathParams("id") id: number) {
    const user = await this.prisma.user.findFirst({ where: { id } });
    console.log(user, id);
    return user;
  }

  @Post("/")
  @Returns(HttpStatus.CREATED)
  async create(@BodyParams() payload: UserModel) {
    const user = await this.prisma.user.create({
      data: payload
    });

    return user;
  }

  @Patch("/:id")
  @Returns(HttpStatus.OK).Description("Updated")
  async update(@PathParams("id") id: number, @BodyParams() payload: Partial<UserModel>) {
    const user = await this.prisma.user.update({
      data: payload,
      where: { id }
    });

    return user;
  }

  @Delete("/:id")
  @Returns(HttpStatus.OK).Description("Deleted")
  async delete(@PathParams("id") id: number) {
    console.log("route", id);
    await this.prisma.user.delete({
      where: { id }
    });
  }
}
