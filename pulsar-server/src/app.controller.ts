import { Controller, Get, Render } from "@nestjs/common";
import { SettingsService } from "./modules/settings/settings.service";
import { TasksService } from "./modules/tasks/tasks.service";
import { WorksService } from "./modules/work/works.service";
import { SETTING, Setting } from "./modules/settings/settings.interface";
import { connectClient } from "src/modules/api/socket-client.service";

@Controller()
export class AppController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly tasksService: TasksService,
    private readonly worksService: WorksService,
  ) {
    let host = "";
    let port = "";
    let station = "";
    this.settingsService.getAll().then((items) => {
      const settings = items.settings.result;
      let result: Setting = settings.find(
        (setting) => setting.id === SETTING.SETTING_SERVER,
      );
      host = result.value;
      result = settings.find((setting) => setting.id === SETTING.SETTING_PORT);
      port = result.value;
      result = settings.find(
        (setting) => setting.id === SETTING.SETTING_STATION,
      );
      station = result.value;
      connectClient(host, port, station);
      this.settingsService.createEvents();
      this.tasksService.createEvents();
      this.worksService.createEvents();
    });
  }

  @Get()
  @Render("index")
  root() {
    // root route
  }
}
