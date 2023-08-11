import { Controller, Get } from "@nestjs/common";

import { ApiResult } from "../api/api.interface";
import { DictonaryService } from "./dictonary.service";

@Controller("api/dictonary")
export class DictonaryController {
  constructor(private readonly dictonaryService: DictonaryService) {}

  @Get()
  index(): Promise<ApiResult> {
    return this.dictonaryService.getAll();
  }
}
