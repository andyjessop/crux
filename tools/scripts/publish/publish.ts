import { ProjectGraph } from "@nrwl/devkit";
import { readFileSync, writeFileSync } from "fs";

export function publish(graph: ProjectGraph, type: 'patch' | 'minor' | 'major') {
  const version = getCurrentVersion();
  const libNodes = getLibs(graph);

  for (const name of libNodes) {
    const packageJson = getProjectPackageJson(name);
    const deps = getProjectDeps(graph, name);

    for (const dep of deps) {
      packageJson.dependencies[dep] = version;
    }

    writePackageJson(packageJson, name);
  }
  // for each lib node
    // add dependencies to package.json
  // run nx build
  // for each lib node
    // npm publish dist/packages/[name] --access=public
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

  writeFileSync(path, json);
}

function getCurrentVersion() {
  const { version } = JSON.parse(readFileSync(`package.json`, 'utf8'));

  console.log(`Current version: ${version}`);

  return version;
}

function getProjectPackageJson(name: string) {
  return JSON.parse(readFileSync(`${getPackagePath(name)}/package.json`, 'utf8'));
}

function getProjectDeps(graph: ProjectGraph, name: string): string[] {
  const deps = [];

  for (const file of graph.nodes[name].data.files) {
    for (const dep of file.deps) {
      if (!dep.starsWith('npm:')) {
        deps.push(dep);
      }
    }
  }

  return [...new Set(deps)];
}