#! /usr/bin/env node

import { getElectronVersion, exec, getGypEnv } from "./util/util"
import { printErrorAndExit } from "./util/promise"
import * as path from "path"
import yargs = require("yargs")
import { readPackageJson } from "./util/readPackageJson"
import { log } from "./util/log"

//noinspection JSUnusedLocalSymbols
const __awaiter = require("./util/awaiter")

const args: any = yargs
  .option("arch", {
    choices: ["ia32", "x64"],
  }).argv

const projectDir = process.cwd()
const devPackageFile = path.join(projectDir, "package.json")

async function main() {
  const arch = args.arch || process.arch
  log(`Execute node-gyp rebuild for arch ${arch}`)
  await exec(process.platform === "win32" ? "node-gyp.cmd" : "node-gyp", ["rebuild"], {
    env: getGypEnv(await getElectronVersion(await readPackageJson(devPackageFile), devPackageFile), arch),
  })
}

try {
  main()
}
catch (e) {
  printErrorAndExit(e)
}