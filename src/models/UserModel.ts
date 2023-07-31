import { Email, Property } from "@tsed/schema";
import { User } from "@prisma/client";

export class UserModel implements User {
  @Property()
  id: number;

  @Property()
  name: string;

  @Property()
  @Email()
  email: string;

  @Property()
  password: string;
}
