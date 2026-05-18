const fs = require("fs");
const { spawn } = require("child_process");

const TRIGGER_FILE = ".runner/.trigger";
const RESULT_FILE = "src/assets/test-result.txt";

function ensureTriggerFile() {
  if (!fs.existsSync(TRIGGER_FILE)) {
    fs.writeFileSync(TRIGGER_FILE, Date.now().toString());
  }
}

function writeResult(status) {
  const content = `__TEST_RESULT__${status}__`;
  fs.writeFileSync(RESULT_FILE, content);
  console.log("[Runner] result:", content);
}

function runTests() {
  console.log("[Runner] running tests...");

  const testProcess = spawn("npm", ["run", "test"], {
    shell: true,
  });

  let fullOutput = "";

  testProcess.stdout.on("data", (data) => {
    const text = data.toString();
    fullOutput += text;

    process.stdout.write("[JEST] " + text);
  });

  testProcess.stderr.on("data", (data) => {
    const text = data.toString();
    fullOutput += text;

    process.stderr.write("[JEST ERROR] " + text);
  });

  testProcess.on("close", (code) => {
    console.log("[Runner] test process finished with code:", code);

    const status = code === 0 ? "PASS" : "FAIL";

    writeResult(status);

    // opcional: salvar output completo
    fs.writeFileSync("src/assets/test-output.txt", fullOutput);
  });
}

function watchTrigger() {
  fs.watch(TRIGGER_FILE, (eventType) => {
    if (eventType === "change") {
      console.log("[Runner] trigger detected");
      runTests();
    }
  });
}

function bootstrap() {
  ensureTriggerFile();
  watchTrigger();
  console.log("[Runner] ready");
}

bootstrap();
