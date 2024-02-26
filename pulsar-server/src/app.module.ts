import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ApiModule } from "./modules/api/api.module";
import { SettingsModule } from "./modules/settings/settings.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { DictonaryModule } from "./modules/dictonary/dictonary.module";
import { WorksModule } from "./modules/work/works.module";
import { ActionType } from "./modules/dictonary/entities/action-types.entity";
import { StatusType } from "./modules/dictonary/entities/status-types.entity";
import { WorkType } from "./modules/dictonary/entities/work-types.entity";
import { Setting } from "./modules/settings/entities/setting.entity";
import { TaskPack } from "./modules/tasks/entities/task.entity";
import { WorkPack } from "./modules/work/entities/work.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'pulsar.sqlite',
      synchronize: true,
      entities: [ActionType, StatusType, WorkType, Setting, TaskPack, WorkPack],
    }),      
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
