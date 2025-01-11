import * as fs from "node:fs/promises";
import { App, contextBridge, ipcRenderer } from "electron";
import { Logger } from "./utils/logger";

let getAppPath = "";

document.addEventListener("DOMContentLoaded", async () => {
  getAppPath = await ipcRenderer.invoke("getAppPath");
  const observer = new MutationObserver(callback);
  const config = { attributes: true, childList: true, subtree: true };
  observer.observe(document.body, config);
});

window.addEventListener("load", () => {
  const logger = new Logger("fileLoader");
  if (!document.querySelector("style.desktop-added-style")) {
    const settingsJsonPath = getAppPath + "\\settings.json";
    logger.info(`Load Configuration: (${settingsJsonPath})`);
    fs.readFile(settingsJsonPath)
      .then((file) => {
        logger.info(
          `configuration loading completed. (${settingsJsonPath})`
        );
        const json = JSON.parse(file.toString());

        //Style (Custom CSS)
        const style = document.createElement("style");
        style.classList.add("desktop-added-style");
        style.innerHTML = json.custom_css;
        document.body.appendChild(style);

        //
        logger.info(
          `configuration setting apply complete. (${settingsJsonPath})`
        );
      })
      .catch((err) => {
        if (err.toString().startsWith("ENOENT: ")) {
          logger.warn("settings.json not found; creating settings.json");
          fs.writeFile(
            getAppPath + "\\settings.json",
            JSON.stringify({ custom_css: "" })
          );
        } else {
          logger.warn("Error: setting read error");
        }
      });
  }
});

function callback() {
  
}
