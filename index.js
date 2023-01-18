const { spawn } = require('child_process');

console.warn('This script will only work on Windows or WSL')

console.log(process.platform);
console.log();
let dir = process.cwd()
const os = process.platform;

const runOnWindows = true;

if (os !== 'win32') {
  dir = ("" + dir).replace(/\/mnt\/([a-z])/i, "$1:").replace(/\//g, '\\');
}

const CHROME_ON_WINDOWS = ['cmd.exe', '/C', "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"]

const EXECUTABLE_BY_OS = {
  'linux' : runOnWindows?CHROME_ON_WINDOWS:['google-chrome'],
  'win32' : CHROME_ON_WINDOWS
}

const exec = EXECUTABLE_BY_OS[os];
const params = ['--headless', '--run-all-compositor-stages-before-draw', '--print-to-pdf-no-header', '--no-margins', '--print-to-pdf=' + dir + '/resume-backend.pdf', '--disable-gpu', dir + '/resume.html'];
const executable = exec[0];
args = exec.concat(params);
args.shift();

console.log("Executable:", executable);
console.log("Args : ", args);
const child = spawn(executable, args);

child.stdout.on('data', (data) => {
  console.log(`stdout:\n${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

child.on('error', (error) => {
  console.error(`error: ${error.message}`);
});

child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
