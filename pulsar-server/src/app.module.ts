import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

import { ApiModule } from "./modules/api/api.module";
import { SettingsModule } from "./modules/settings/settings.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { DictonaryModule } from "./modules/dictonary/dictonary.module";
import { WorksModule } from "./modules/work/works.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../", "client"),
    }),
    SettingsModule,
    ApiModule,
    DictonaryModule,
    TasksModule,
    WorksModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
