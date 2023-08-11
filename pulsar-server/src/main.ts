import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, "../", "client"));
  app.setViewEngine("html");
  app.enableCors({
    exposedHeaders: "Content-Disposition",
  });
  await app.listen(80);
}
bootstrap();
