#!/usr/bin/env node

/**
 * Upgrade version of @rd packages
 * Run at root
 */

const execSync = require("child_process").execSync;

// 1. Get all workspace
const workspaceInfos = JSON.parse(execSync("npm query .workspace --json"));
// 2. Get only `@rd` workspaces
const rdWorkspaces = workspaceInfos.filter(({ name }) =>
  name.startsWith("@rd/")
);
const tags = [];

rdWorkspaces.forEach((workspace) => {
  // 3. Bump version of each @rd workspaces
  console.log("\nworkspace:", workspace.name);
  let newVersion = execSync(
    `npm version patch --workspace=${workspace.name} --workspaces-update=false`
  );
  newVersion = String(newVersion).split("\n")[1].replace("v", "");
  console.info("old version ", workspace.version);
  console.info("new version ", newVersion);
  tags.push(`${workspace.name}@${newVersion}`);

  // 4. Get workspaces those have current workspace as dependency.
  const dependants = workspaceInfos.filter(
    ({ dependencies }) => dependencies && dependencies[workspace.name]
  );
  if (!dependants.length) return;

  // 5. Bump dependency version
  dependants.forEach((dependantWs) => {
    execSync(
      `npm pkg set dependencies.${workspace.name}='${newVersion}' --workspace='${dependantWs.name}'`
    );
  });

  // 6. Reports
  console.log("updated dependant(s):");
  dependants.forEach((dependantWs) => {
    let dependantVersion = execSync(
      `npm pkg get dependencies.${workspace.name} --workspace='${dependantWs.name}'`
    );
    dependantVersion = String(dependantVersion).split("\n")[0];
    console.log(
      "\t ",
      `${dependantWs.name}.dependencies.${workspace.name}`,
      ": ",
      dependantVersion
    );
  });
});

// 7. npm install
console.info("Run `npm install`");
execSync("npm install", { stdio: "inherit" });

// 8. Git
execSync(`git add . && git commit -m "${tags.join(", ")}"`, {
  stdio: "inherit",
});
tags.forEach((tag) => {
  execSync(`git tag ${tag}`, { stdio: "inherit" });
});

// 9. Publish
rdWorkspaces.forEach((workspace) => {
  execSync(`npm publish --workspace=${workspace.name}`, { stdio: "inherit" });
});
