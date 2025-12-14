// vite.config.ts
import { rmSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "file:///D:/Apps/CsvEditor/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Apps/CsvEditor/node_modules/@vitejs/plugin-react/dist/index.js";
import electron from "file:///D:/Apps/CsvEditor/node_modules/vite-plugin-electron/dist/simple.mjs";

// package.json
var package_default = {
  name: "electron-vite-react",
  version: "2.2.0",
  main: "dist-electron/main/index.js",
  description: "Electron Vite React boilerplate.",
  author: "devlilic13",
  license: "MIT",
  private: true,
  debug: {
    env: {
      VITE_DEV_SERVER_URL: "http://127.0.0.1:7777/"
    }
  },
  type: "module",
  scripts: {
    dev: "vite",
    build: "tsc && vite build && electron-builder",
    preview: "vite preview",
    pretest: "vite build --mode=test",
    test: "vitest run"
  },
  dependencies: {
    "@types/electron-store": "^1.3.1",
    "electron-store": "^11.0.2",
    "electron-updater": "^6.3.9",
    konva: "^10.0.12",
    papaparse: "^5.5.3",
    "react-konva": "^18.2.14",
    uuid: "^13.0.0"
  },
  devDependencies: {
    "@playwright/test": "^1.57.0",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/papaparse": "^5.5.1",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "@vitest/coverage-v8": "^2.1.9",
    autoprefixer: "^10.4.22",
    electron: "^33.2.0",
    "electron-builder": "^24.13.3",
    jsdom: "^27.3.0",
    postcss: "^8.5.6",
    "postcss-import": "^16.1.0",
    react: "^18.3.1",
    "react-dom": "^18.3.1",
    tailwindcss: "^3.4.19",
    typescript: "^5.4.2",
    vite: "^5.4.11",
    "vite-plugin-electron": "^0.29.0",
    "vite-plugin-electron-renderer": "^0.14.6",
    vitest: "^2.1.9"
  }
};

// vite.config.ts
var __vite_injected_original_dirname = "D:\\Apps\\CsvEditor";
var vite_config_default = defineConfig(({ command }) => {
  rmSync("dist-electron", { recursive: true, force: true });
  const isServe = command === "serve";
  const isBuild = command === "build";
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;
  return {
    resolve: {
      alias: {
        "@": path.join(__vite_injected_original_dirname, "src")
      }
    },
    plugins: [
      react(),
      electron({
        main: {
          // Shortcut of `build.lib.entry`
          entry: "electron/main/index.ts",
          onstart(args) {
            if (process.env.VSCODE_DEBUG) {
              console.log(
                /* For `.vscode/.debug.script.mjs` */
                "[startup] Electron App"
              );
            } else {
              args.startup();
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: "dist-electron/main",
              rollupOptions: {
                external: Object.keys("dependencies" in package_default ? package_default.dependencies : {})
              }
            }
          }
        },
        preload: {
          // Shortcut of `build.rollupOptions.input`.
          // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
          input: "electron/preload/index.ts",
          vite: {
            build: {
              sourcemap: sourcemap ? "inline" : void 0,
              // #332
              minify: isBuild,
              outDir: "dist-electron/preload",
              rollupOptions: {
                external: Object.keys("dependencies" in package_default ? package_default.dependencies : {})
              }
            }
          }
        },
        // Ployfill the Electron and Node.js API for Renderer process.
        // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
        // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
        renderer: {}
      })
    ],
    server: process.env.VSCODE_DEBUG && (() => {
      const url = new URL(package_default.debug.env.VITE_DEV_SERVER_URL);
      return {
        host: url.hostname,
        port: +url.port
      };
    })(),
    clearScreen: false
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcQXBwc1xcXFxDc3ZFZGl0b3JcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEFwcHNcXFxcQ3N2RWRpdG9yXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9BcHBzL0NzdkVkaXRvci92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IHJtU3luYyB9IGZyb20gJ25vZGU6ZnMnXHJcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCdcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgZWxlY3Ryb24gZnJvbSAndml0ZS1wbHVnaW4tZWxlY3Ryb24vc2ltcGxlJ1xyXG5pbXBvcnQgcGtnIGZyb20gJy4vcGFja2FnZS5qc29uJ1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQgfSkgPT4ge1xyXG4gIHJtU3luYygnZGlzdC1lbGVjdHJvbicsIHsgcmVjdXJzaXZlOiB0cnVlLCBmb3JjZTogdHJ1ZSB9KVxyXG5cclxuICBjb25zdCBpc1NlcnZlID0gY29tbWFuZCA9PT0gJ3NlcnZlJ1xyXG4gIGNvbnN0IGlzQnVpbGQgPSBjb21tYW5kID09PSAnYnVpbGQnXHJcbiAgY29uc3Qgc291cmNlbWFwID0gaXNTZXJ2ZSB8fCAhIXByb2Nlc3MuZW52LlZTQ09ERV9ERUJVR1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczoge1xyXG4gICAgICAgICdAJzogcGF0aC5qb2luKF9fZGlybmFtZSwgJ3NyYycpXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICByZWFjdCgpLFxyXG4gICAgICBlbGVjdHJvbih7XHJcbiAgICAgICAgbWFpbjoge1xyXG4gICAgICAgICAgLy8gU2hvcnRjdXQgb2YgYGJ1aWxkLmxpYi5lbnRyeWBcclxuICAgICAgICAgIGVudHJ5OiAnZWxlY3Ryb24vbWFpbi9pbmRleC50cycsXHJcbiAgICAgICAgICBvbnN0YXJ0KGFyZ3MpIHtcclxuICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52LlZTQ09ERV9ERUJVRykge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKC8qIEZvciBgLnZzY29kZS8uZGVidWcuc2NyaXB0Lm1qc2AgKi8nW3N0YXJ0dXBdIEVsZWN0cm9uIEFwcCcpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgYXJncy5zdGFydHVwKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHZpdGU6IHtcclxuICAgICAgICAgICAgYnVpbGQ6IHtcclxuICAgICAgICAgICAgICBzb3VyY2VtYXAsXHJcbiAgICAgICAgICAgICAgbWluaWZ5OiBpc0J1aWxkLFxyXG4gICAgICAgICAgICAgIG91dERpcjogJ2Rpc3QtZWxlY3Ryb24vbWFpbicsXHJcbiAgICAgICAgICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgZXh0ZXJuYWw6IE9iamVjdC5rZXlzKCdkZXBlbmRlbmNpZXMnIGluIHBrZyA/IHBrZy5kZXBlbmRlbmNpZXMgOiB7fSksXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwcmVsb2FkOiB7XHJcbiAgICAgICAgICAvLyBTaG9ydGN1dCBvZiBgYnVpbGQucm9sbHVwT3B0aW9ucy5pbnB1dGAuXHJcbiAgICAgICAgICAvLyBQcmVsb2FkIHNjcmlwdHMgbWF5IGNvbnRhaW4gV2ViIGFzc2V0cywgc28gdXNlIHRoZSBgYnVpbGQucm9sbHVwT3B0aW9ucy5pbnB1dGAgaW5zdGVhZCBgYnVpbGQubGliLmVudHJ5YC5cclxuICAgICAgICAgIGlucHV0OiAnZWxlY3Ryb24vcHJlbG9hZC9pbmRleC50cycsXHJcbiAgICAgICAgICB2aXRlOiB7XHJcbiAgICAgICAgICAgIGJ1aWxkOiB7XHJcbiAgICAgICAgICAgICAgc291cmNlbWFwOiBzb3VyY2VtYXAgPyAnaW5saW5lJyA6IHVuZGVmaW5lZCwgLy8gIzMzMlxyXG4gICAgICAgICAgICAgIG1pbmlmeTogaXNCdWlsZCxcclxuICAgICAgICAgICAgICBvdXREaXI6ICdkaXN0LWVsZWN0cm9uL3ByZWxvYWQnLFxyXG4gICAgICAgICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIGV4dGVybmFsOiBPYmplY3Qua2V5cygnZGVwZW5kZW5jaWVzJyBpbiBwa2cgPyBwa2cuZGVwZW5kZW5jaWVzIDoge30pLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gUGxveWZpbGwgdGhlIEVsZWN0cm9uIGFuZCBOb2RlLmpzIEFQSSBmb3IgUmVuZGVyZXIgcHJvY2Vzcy5cclxuICAgICAgICAvLyBJZiB5b3Ugd2FudCB1c2UgTm9kZS5qcyBpbiBSZW5kZXJlciBwcm9jZXNzLCB0aGUgYG5vZGVJbnRlZ3JhdGlvbmAgbmVlZHMgdG8gYmUgZW5hYmxlZCBpbiB0aGUgTWFpbiBwcm9jZXNzLlxyXG4gICAgICAgIC8vIFNlZSBcdUQ4M0RcdURDNDkgaHR0cHM6Ly9naXRodWIuY29tL2VsZWN0cm9uLXZpdGUvdml0ZS1wbHVnaW4tZWxlY3Ryb24tcmVuZGVyZXJcclxuICAgICAgICByZW5kZXJlcjoge30sXHJcbiAgICAgIH0pLFxyXG4gICAgXSxcclxuICAgIHNlcnZlcjogcHJvY2Vzcy5lbnYuVlNDT0RFX0RFQlVHICYmICgoKSA9PiB7XHJcbiAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocGtnLmRlYnVnLmVudi5WSVRFX0RFVl9TRVJWRVJfVVJMKVxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGhvc3Q6IHVybC5ob3N0bmFtZSxcclxuICAgICAgICBwb3J0OiArdXJsLnBvcnQsXHJcbiAgICAgIH1cclxuICAgIH0pKCksXHJcbiAgICBjbGVhclNjcmVlbjogZmFsc2UsXHJcbiAgfVxyXG59KVxyXG4iLCAie1xyXG4gIFwibmFtZVwiOiBcImVsZWN0cm9uLXZpdGUtcmVhY3RcIixcclxuICBcInZlcnNpb25cIjogXCIyLjIuMFwiLFxyXG4gIFwibWFpblwiOiBcImRpc3QtZWxlY3Ryb24vbWFpbi9pbmRleC5qc1wiLFxyXG4gIFwiZGVzY3JpcHRpb25cIjogXCJFbGVjdHJvbiBWaXRlIFJlYWN0IGJvaWxlcnBsYXRlLlwiLFxyXG4gIFwiYXV0aG9yXCI6IFwiZGV2bGlsaWMxM1wiLFxyXG4gIFwibGljZW5zZVwiOiBcIk1JVFwiLFxyXG4gIFwicHJpdmF0ZVwiOiB0cnVlLFxyXG4gIFwiZGVidWdcIjoge1xyXG4gICAgXCJlbnZcIjoge1xyXG4gICAgICBcIlZJVEVfREVWX1NFUlZFUl9VUkxcIjogXCJodHRwOi8vMTI3LjAuMC4xOjc3NzcvXCJcclxuICAgIH1cclxuICB9LFxyXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxyXG4gIFwic2NyaXB0c1wiOiB7XHJcbiAgICBcImRldlwiOiBcInZpdGVcIixcclxuICAgIFwiYnVpbGRcIjogXCJ0c2MgJiYgdml0ZSBidWlsZCAmJiBlbGVjdHJvbi1idWlsZGVyXCIsXHJcbiAgICBcInByZXZpZXdcIjogXCJ2aXRlIHByZXZpZXdcIixcclxuICAgIFwicHJldGVzdFwiOiBcInZpdGUgYnVpbGQgLS1tb2RlPXRlc3RcIixcclxuICAgIFwidGVzdFwiOiBcInZpdGVzdCBydW5cIlxyXG4gIH0sXHJcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xyXG4gICAgXCJAdHlwZXMvZWxlY3Ryb24tc3RvcmVcIjogXCJeMS4zLjFcIixcclxuICAgIFwiZWxlY3Ryb24tc3RvcmVcIjogXCJeMTEuMC4yXCIsXHJcbiAgICBcImVsZWN0cm9uLXVwZGF0ZXJcIjogXCJeNi4zLjlcIixcclxuICAgIFwia29udmFcIjogXCJeMTAuMC4xMlwiLFxyXG4gICAgXCJwYXBhcGFyc2VcIjogXCJeNS41LjNcIixcclxuICAgIFwicmVhY3Qta29udmFcIjogXCJeMTguMi4xNFwiLFxyXG4gICAgXCJ1dWlkXCI6IFwiXjEzLjAuMFwiXHJcbiAgfSxcclxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XHJcbiAgICBcIkBwbGF5d3JpZ2h0L3Rlc3RcIjogXCJeMS41Ny4wXCIsXHJcbiAgICBcIkB0ZXN0aW5nLWxpYnJhcnkvamVzdC1kb21cIjogXCJeNi45LjFcIixcclxuICAgIFwiQHRlc3RpbmctbGlicmFyeS9yZWFjdFwiOiBcIl4xNi4zLjBcIixcclxuICAgIFwiQHRlc3RpbmctbGlicmFyeS91c2VyLWV2ZW50XCI6IFwiXjE0LjYuMVwiLFxyXG4gICAgXCJAdHlwZXMvcGFwYXBhcnNlXCI6IFwiXjUuNS4xXCIsXHJcbiAgICBcIkB0eXBlcy9yZWFjdFwiOiBcIl4xOC4zLjEyXCIsXHJcbiAgICBcIkB0eXBlcy9yZWFjdC1kb21cIjogXCJeMTguMy4xXCIsXHJcbiAgICBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI6IFwiXjQuMy4zXCIsXHJcbiAgICBcIkB2aXRlc3QvY292ZXJhZ2UtdjhcIjogXCJeMi4xLjlcIixcclxuICAgIFwiYXV0b3ByZWZpeGVyXCI6IFwiXjEwLjQuMjJcIixcclxuICAgIFwiZWxlY3Ryb25cIjogXCJeMzMuMi4wXCIsXHJcbiAgICBcImVsZWN0cm9uLWJ1aWxkZXJcIjogXCJeMjQuMTMuM1wiLFxyXG4gICAgXCJqc2RvbVwiOiBcIl4yNy4zLjBcIixcclxuICAgIFwicG9zdGNzc1wiOiBcIl44LjUuNlwiLFxyXG4gICAgXCJwb3N0Y3NzLWltcG9ydFwiOiBcIl4xNi4xLjBcIixcclxuICAgIFwicmVhY3RcIjogXCJeMTguMy4xXCIsXHJcbiAgICBcInJlYWN0LWRvbVwiOiBcIl4xOC4zLjFcIixcclxuICAgIFwidGFpbHdpbmRjc3NcIjogXCJeMy40LjE5XCIsXHJcbiAgICBcInR5cGVzY3JpcHRcIjogXCJeNS40LjJcIixcclxuICAgIFwidml0ZVwiOiBcIl41LjQuMTFcIixcclxuICAgIFwidml0ZS1wbHVnaW4tZWxlY3Ryb25cIjogXCJeMC4yOS4wXCIsXHJcbiAgICBcInZpdGUtcGx1Z2luLWVsZWN0cm9uLXJlbmRlcmVyXCI6IFwiXjAuMTQuNlwiLFxyXG4gICAgXCJ2aXRlc3RcIjogXCJeMi4xLjlcIlxyXG4gIH1cclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJPLFNBQVMsY0FBYztBQUNsUSxPQUFPLFVBQVU7QUFDakIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sY0FBYzs7O0FDSnJCO0FBQUEsRUFDRSxNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsRUFDWCxNQUFRO0FBQUEsRUFDUixhQUFlO0FBQUEsRUFDZixRQUFVO0FBQUEsRUFDVixTQUFXO0FBQUEsRUFDWCxTQUFXO0FBQUEsRUFDWCxPQUFTO0FBQUEsSUFDUCxLQUFPO0FBQUEsTUFDTCxxQkFBdUI7QUFBQSxJQUN6QjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE1BQVE7QUFBQSxFQUNSLFNBQVc7QUFBQSxJQUNULEtBQU87QUFBQSxJQUNQLE9BQVM7QUFBQSxJQUNULFNBQVc7QUFBQSxJQUNYLFNBQVc7QUFBQSxJQUNYLE1BQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxjQUFnQjtBQUFBLElBQ2QseUJBQXlCO0FBQUEsSUFDekIsa0JBQWtCO0FBQUEsSUFDbEIsb0JBQW9CO0FBQUEsSUFDcEIsT0FBUztBQUFBLElBQ1QsV0FBYTtB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
