import { ProjectGraph } from "@nrwl/devkit";
import { readFileSync, writeFileSync } from "fs";
import { exec } from 'child_process';
import { config } from 'dotenv';

config();

execute('npx nx dep-graph --file=tools/scripts/publish/tmp/project.json')
  .then(() => {
    const projectJson = JSON.parse(readFileSync(`tools/scripts/publish/tmp/project.json`, 'utf8'));
    versionPackages(projectJson.graph);
  })

export async function versionPackages(graph: ProjectGraph) {
  const version = getCurrentVersion();
  const libNodes = getLibs(graph);

  for (const name of libNodes) {
    const packageJson = getProjectPackageJson(name, 'dev');
    packageJson.version = version;

    writePackageJson(packageJson, name);
  }
}

function getLibs(graph: ProjectGraph) {
  return Object.keys(graph.nodes)
    .filter(nodeName => graph.nodes[nodeName].type === 'lib');
}

function getPackagePath(name: string) {
  return `packages/${name}`;
}

function getPackageDistPath(name: string) {
  return `dist/${getPackagePath(name)}`;
}

function writePackageJson(obj: any, name: string) {
  const json = JSON.stringify(obj, null, 2);
  const path = `${getPackagePath(name)}/package.json`;

  console.log(`Writing JSON to ${path}`);
  console.log(json);
  writeFileSync(path, json);
}

function getCurrentVersion() {
  const { version } = JSON.parse(readFileSync(`package.json`, 'utf8'));

  console.log(`Current version: ${version}`);

  return version;
}

function getProjectPackageJson(name: string, env: 'dev' | 'prod') {
  return JSON.parse(readFileSync(`${env === 'prod' ? getPackageDistPath(name) : getPackagePath(name)}/package.json`, 'utf8'));
}

function getProjectDeps(graph: ProjectGraph, name: string): string[] {
  const deps = [];

  for (const file of graph.nodes[name].data.files) {
    for (const dep of (file.deps || [])) {
      if (dep && !dep.startsWith('npm:')) {
        deps.push(dep);
      }
    }
  }

  return [...new Set(deps)];
}

function execute(command: string) {
  return new Promise<string>((resolve) => {
    exec(command, function(error, stdout, stderr) {
      resolve(stdout);
    });
  });
};