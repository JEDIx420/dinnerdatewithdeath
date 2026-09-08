import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const ARTIFACT_DIR = '/Users/vincyvincent/.gemini/antigravity/brain/e41f54cb-057e-43ce-8266-21dcef30d3f0';

async function captureAll(): Promise<void> {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--window-size=1280,720',
    '--no-first-run',
    '--no-default-browser-check',
  ]);

  await new Promise((r) => setTimeout(r, 1200));

  const views = [
    { name: 'refined_new_game_spawn.png', url: 'http://127.0.0.1:4180/?scene=mansion' },
    { name: 'refined_bedchamber.png', url: 'http://127.0.0.1:4180/?scene=mansion&pos=bedchamber' },
    { name: 'refined_landing.png', url: 'http://127.0.0.1:4180/?scene=mansion&pos=landing' },
    { name: 'refined_staircase.png', url: 'http://127.0.0.1:4180/?scene=mansion&pos=staircase' },
    { name: 'refined_foot_of_stairs.png', url: 'http://127.0.0.1:4180/?scene=mansion&pos=greathall' },
    { name: 'refined_dining.png', url: 'http://127.0.0.1:4180/?scene=mansion&pos=dining' },
    { name: 'refined_lounge.png', url: 'http://127.0.0.1:4180/?scene=mansion&pos=lounge' },
  ];

  for (const v of views) {
    console.log(`Starting capture: ${v.name}`);
    const targetRes = await fetch('http://127.0.0.1:9222/json/new?' + encodeURIComponent(v.url), { method: 'PUT' });
    const target = (await targetRes.json()) as { id: string; webSocketDebuggerUrl: string };
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    let id = 1;
    const send = <T = unknown>(method: string, params: Record<string, unknown> = {}): Promise<T> =>
      new Promise((resolve) => {
        const msgId = id++;
        const handler = (evt: MessageEvent): void => {
          const res = JSON.parse(evt.data as string) as { id: number; result: T };
          if (res.id === msgId) {
            ws.removeEventListener('message', handler);
            resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });

    await new Promise((r) => (ws.onopen = () => r(null)));
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 720,
      deviceScaleFactor: 1,
      mobile: false,
    });

    let active = false;
    for (let attempts = 0; attempts < 60; attempts++) {
      await new Promise((r) => setTimeout(r, 250));
      const evalRes = await send<{ result?: { value?: boolean } }>('Runtime.evaluate', {
        expression: 'Boolean(window.__PHASER_GAME__ && window.__PHASER_GAME__.scene && window.__PHASER_GAME__.scene.isActive("MansionScene"))',
        returnByValue: true,
      });
      if (evalRes?.result?.value === true) {
        active = true;
        break;
      }
    }

    if (!active) {
      console.error(`Timeout waiting for MansionScene on ${v.name}`);
    }

    await new Promise((r) => setTimeout(r, 600));

    const shot = await send<{ data: string }>('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(shot.data, 'base64');
    fs.writeFileSync(path.join(ARTIFACT_DIR, v.name), buffer);
    console.log(`Saved ${v.name} (${buffer.length} bytes)`);

    ws.close();
    await fetch(`http://127.0.0.1:9222/json/close/${target.id}`);
  }

  chrome.kill();
  console.log('All screenshots successfully captured via CDP!');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  captureAll().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
