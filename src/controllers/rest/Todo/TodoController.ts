import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";

@Controller("/todos")
export class TodoController {
  @Get("/")
  get() {
    return "hello";
  }
}
