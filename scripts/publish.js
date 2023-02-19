#!/usr/bin/env node

/**
 * Publish @rd packages
 * Run at root
 */

const execSync = require("child_process").execSync;

const workspaceInfos = JSON.parse(execSync("npm query .workspace --json"));
workspaceInfos
  .filter(({ name }) => name.startsWith("@rd/"))
  .forEach((workspace) => {
    execSync(`npm publish --workspace=${workspace.name}`, { stdio: "inherit" });
  });
