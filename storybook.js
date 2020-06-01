const { spawn } = require("child_process");
const chokidar = require("chokidar");
const storybook = require("@storybook/web-components/standalone");

storybook({
  configDir: ".storybook",
  mode: "dev",
  port: 6005,
  staticDir: [".dist", "public"]
});

let rollup = rollupWatch();

function rollupWatch() {
  return spawn("npm", ["run", "rollup:watch"], {
    detached: true,
    stdio: "inherit"
  });
}

function rollupWatchKill() {
  process.kill(-rollup.pid);
}

function rollupWatchRestart() {
  rollupWatchKill();
  rollup = rollupWatch();
}

// Rollup uses glob for input, so when a new files are added/removed
// we need to restart Rollup
chokidar
  .watch("./src/modules", {
    ignoreInitial: true,
    persistent: true
  })
  .on("add", rollupWatchRestart)
  .on("unlink", rollupWatchRestart);

// so the program will not close instantl
process.stdin.resume();
// do something when app is closing
process.on("exit", exitHandler.bind(null, { cleanup: true }));
// catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, { exit: true }));
// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
// catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));

function exitHandler(options, exitCode) {
  if (options.cleanup) {
    rollupWatchKill();
  }
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (options.exit) process.exit();
}
