import { Project } from "ts-morph";
import { outputFileSync } from "fs-extra";
import path from "path";

const project = new Project({
  tsConfigFilePath: path.join(__dirname, "../tsconfig.json"),
});

const filePath = path.join(__dirname, "../server/entities/play-feature.ts");
const sourceFile = project.addSourceFileAtPath(filePath);

const resolvedTypes = sourceFile
  .getTypeAliases()
  .map((type) => `type ${type.getName()} = ${type.getType().getText()}`)
  .join("\n");

const outputFilePath = path.join(__dirname, "../generated/play-feature-types");
outputFileSync(outputFilePath, resolvedTypes, "utf-8");

console.log("Resolved types written to", outputFilePath);
