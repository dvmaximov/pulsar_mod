import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

import { ApiModule } from "./modules/api/api.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { DictonaryModule } from "./modules/dictonary/dictonary.module";
import { WorksModule } from "./modules/work/works.module";
import { SettingsModule } from "./modules/settings/settings.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../", "client"),
    }),
    ApiModule,
    DictonaryModule,
    SettingsModule,
    TasksModule,
    WorksModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
