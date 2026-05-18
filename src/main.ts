import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

(function setupTestBridge() {
  const RESULT_PREFIX = '__TEST_RESULT__';
  let lastResult = '';
  let isFastPolling = false;

  function extractStatus(text: string): 'RUNNING' | 'PASS' | 'FAIL' | null {
    if (text.includes(`${RESULT_PREFIX}RUNNING__`)) return 'RUNNING';
    if (text.includes(`${RESULT_PREFIX}PASS__`)) return 'PASS';
    if (text.includes(`${RESULT_PREFIX}FAIL__`)) return 'FAIL';
    return null;
  }

  function poll() {
    const intervalTime = isFastPolling ? 500 : 3000;

    setTimeout(async () => {
      try {
        const resResult = await fetch(
          '/assets/test-result.txt?cache=' + Date.now(),
        );
        if (resResult.ok) {
          const textResult = await resResult.text();

          if (textResult.includes(RESULT_PREFIX) && textResult !== lastResult) {
            lastResult = textResult;
            const status = extractStatus(textResult);

            if (status === 'RUNNING') {
              console.log('[Bridge] Teste iniciado. Acelerando polling...');
              isFastPolling = true;
            } else if (status === 'PASS' || status === 'FAIL') {
              console.log(
                `[Bridge] Teste finalizado (${status}). Enviando para a plataforma...`,
              );
              isFastPolling = false;

              const resOutput = await fetch(
                '/assets/test-output.txt?cache=' + Date.now(),
              );
              const textOutput = resOutput.ok
                ? await resOutput.text()
                : 'Logs indisponíveis.';

              window.parent.parent.postMessage(
                {
                  type: 'TEST_RESULT',
                  status: status,
                  output: textOutput,
                },
                '*',
              );
            }
          }
        }
      } catch (err) {}

      poll();
    }, intervalTime);
  }

  console.log('[Bridge] Test Bridge configurada com Polling Inteligente.');
  poll();
})();

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
