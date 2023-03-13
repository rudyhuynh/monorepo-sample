#!/usr/bin/env node

const { execSync } = require("child_process");

const workspaces = JSON.parse(execSync(`npm query .workspace`).toString());

const versionInput = [...process.argv][2];

workspaces
  .filter(({ name }) => name.startsWith("@rd/"))
  .forEach((workspace) => {
    const newVersion = execSync(
      `npm version ${versionInput ? versionInput : "patch"} --workspace ${
        workspace.name
      } --no-workspaces-update`
    )
      .toString()
      .split("\n")[1]
      .slice(1);

    console.log("workspace", workspace.name);
    console.log("\t old version", workspace.version);
    console.log("\t new version", newVersion);

    const userWorkspaces = workspaces.filter(
      ({ dependencies }) => dependencies?.[workspace.name]
    );

    userWorkspaces.forEach((userWorkspace) => {
      if (userWorkspace.dependencies?.[workspace.name] !== "*") {
        execSync(
          `npm pkg set dependencies.${workspace.name}=${newVersion} --workspace ${userWorkspace.name}`
        );

        console.log("\t updated user workspace", userWorkspace.name);
      }
    });
  });

execSync("npm install");

// publish
workspaces
  .filter(({ name }) => name.startsWith("@rd/"))
  .forEach((workspace) => {
    execSync(`npm publish --workspace ${workspace.name}`);
  });
