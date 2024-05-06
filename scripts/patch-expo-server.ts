import { readFileSync, writeFileSync } from "fs";

const path = "node_modules/@expo/server/build/environment.js";

const content = readFileSync(path, "utf-8");

const patchedContent = content.replace(
  "(0, node_1.installGlobals)();",
  "// (0, node_1.installGlobals)(); // Line commented out by patch-expo-server script"
);

writeFileSync(path, patchedContent);
