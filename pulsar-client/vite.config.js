import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, mode }) => {
  const base = process.env.BUILD_DIST === "git" ? "/pulsar" : "/";
  const outputDir =
    process.env.BUILD_DIST === "git" ? "../docs" : "../pulsar-server/client";
  const envDir =
    process.env.DATA_MODE === "STATIC" ? "env/static" : "env/server";

  if (command === "serve") {
    return {
      envDir,
      plugins: [react()],
    };
  } else {
    return {
      envDir,
      base,
      plugins: [react()],
      build: {
        rollupOptions: {
          output: {
            dir: outputDir,
          },
        },
      },
    };
  }
});
