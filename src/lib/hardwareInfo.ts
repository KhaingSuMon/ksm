import { Sha256 } from "@aws-crypto/sha256-js";
interface CrossBrowserDeviceInfo {
  screen: {
    width: number;
    height: number;
    colorDepth: number;
    pixelRatio: number;
  };
  cpu: {
    hardwareConcurrency: number;
  };
  memory: {
    deviceMemory?: number;
  };
  os: {
    platform: string;
  };
  browser: {
    language: string;
  };
  timezone: string;
  touchSupport: {
    maxTouchPoints: number;
  };
  webgl: {
    vendor: string | null;
    renderer: string | null;
  };
  audio: {
    fingerprint: string | null;
  };
  fonts: string[];
  battery: boolean;
}

export type CrossBrowserDeviceInfoFlat = {
  screenWidth: number;
  screenHeight: number;
  screenColorDepth: number;
  screenPixelRatio: number;
  cpuHardwareConcurrency: number;
  deviceMemory?: number;
  osPlatform: string;
  browserLanguage: string;
  timezone: string;
  maxTouchPoints: number;
  webglVendor: string | null;
  webglRenderer: string | null;
  audioFingerprint: string | null;
  fonts: string[];
  hasBattery: boolean;
};

const flatDeviceInfo = (
  info: CrossBrowserDeviceInfo
): CrossBrowserDeviceInfoFlat => {
  return {
    screenWidth: info.screen.width,
    screenHeight: info.screen.height,
    screenColorDepth: info.screen.colorDepth,
    screenPixelRatio: info.screen.pixelRatio,
    cpuHardwareConcurrency: info.cpu.hardwareConcurrency,
    deviceMemory: info.memory.deviceMemory,
    osPlatform: info.os.platform,
    browserLanguage: info.browser.language,
    timezone: info.timezone,
    maxTouchPoints: info.touchSupport.maxTouchPoints,
    webglVendor: info.webgl.vendor,
    webglRenderer: info.webgl.renderer,
    audioFingerprint: info.audio.fingerprint,
    fonts: info.fonts,
    hasBattery: info.battery,
  };
};

const keysList = [
  "screenWidth",
  "screenHeight",
  "screenColorDepth",
  "screenPixelRatio",
  "cpuHardwareConcurrency",
  "deviceMemory",
  "osPlatform",
  "browserLanguage",
  "timezone",
  "maxTouchPoints",
  "webglVendor",
  "webglRenderer",
  "audioFingerprint",
  "fonts",
  "hasBattery",
] as const;

export async function getDeviceInfo(): Promise<{
  digest: string;
  info: CrossBrowserDeviceInfoFlat;
}> {
  const deviceInfo = await getCrossBrowserDeviceInfo();
  const flatInfo = flatDeviceInfo(deviceInfo);

  const fingerprintData = keysList.reduce((pre, cur) => {
    return pre + (flatInfo[cur] ?? "");
  }, "");

  const hash = new Sha256();
  hash.update(fingerprintData);
  return {
    digest: toHex(await hash.digest()),
    info: flatInfo,
  };
}

async function getCrossBrowserDeviceInfo(): Promise<CrossBrowserDeviceInfo> {
  const info: CrossBrowserDeviceInfo = {
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
    },
    cpu: {
      hardwareConcurrency: navigator.hardwareConcurrency,
    },
    memory: {
      deviceMemory: (navigator as any).deviceMemory,
    },
    os: {
      platform: navigator.platform,
    },
    browser: {
      language: navigator.language,
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    touchSupport: {
      maxTouchPoints: navigator.maxTouchPoints,
    },
    webgl: {
      vendor: getWebGLVendor(),
      renderer: getWebGLRenderer(),
    },
    battery: Boolean("getBattery" in navigator),
    audio: {
      fingerprint: await getAudioFingerprint(),
    },
    fonts: await getInstalledFonts(),
  };

  return info;
}
function getWebGLVendor(): string | null {
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) return null;
  const glContext = gl as WebGLRenderingContext;
  return glContext.getParameter(glContext.VENDOR);
}

function getWebGLRenderer(): string | null {
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) return null;
  const glContext = gl as WebGLRenderingContext;
  return glContext.getParameter(glContext.RENDERER);
}

async function getAudioFingerprint(): Promise<string | null> {
  try {
    const AudioContext =
      window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
    const audioContext = new AudioContext(1, 44100, 44100);
    const oscillator = audioContext.createOscillator();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(10000, audioContext.currentTime);
    const compressor = audioContext.createDynamicsCompressor();
    oscillator.connect(compressor);
    compressor.connect(audioContext.destination);
    oscillator.start(0);
    const audioBuffer = await audioContext.startRendering();
    const output = new Float32Array(audioBuffer.length);
    audioBuffer.copyFromChannel(output, 0);
    return output
      .slice(4500, 5000)
      .reduce((acc, val) => acc + Math.abs(val), 0)
      .toString();
  } catch (e) {
    return null;
  }
}

async function getInstalledFonts(): Promise<string[]> {
  const baseFonts = ["monospace", "sans-serif", "serif"];
  const fontList = [
    "Arial",
    "Arial Black",
    "Arial Narrow",
    "Calibri",
    "Cambria",
    "Cambria Math",
    "Comic Sans MS",
    "Consolas",
    "Courier",
    "Courier New",
    "Georgia",
    "Helvetica",
    "Impact",
    "Lucida Console",
    "Lucida Sans Unicode",
    "Microsoft Sans Serif",
    "Palatino Linotype",
    "Times New Roman",
    "Trebuchet MS",
    "Verdana",
  ];

  const available = [];

  for (const font of fontList) {
    let detected = false;
    for (const baseFont of baseFonts) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      context.font = `12px ${baseFont}`;
      const baseFontWidth = context.measureText(font).width;

      context.font = `12px ${font}, ${baseFont}`;
      const testFontWidth = context.measureText(font).width;

      if (baseFontWidth !== testFontWidth) {
        detected = true;
        break;
      }
    }
    if (detected) {
      available.push(font);
    }
  }

  return available;
}

interface BatteryInfo {
  charging: boolean;
  level: number;
  chargingTime: number;
  dischargingTime: number;
}

interface NetworkInfo {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

function getCanvasFingerprint(): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      resolve("");
      return;
    }
    const txt = "abcdefghijklmnopqrstuvwxyz0123456789";
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText(txt, 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText(txt, 4, 17);
    resolve(canvas.toDataURL());
  });
}

async function getBatteryInfo(): Promise<BatteryInfo | null> {
  if ("getBattery" in navigator) {
    try {
      const battery: any = await (navigator as any).getBattery();
      return {
        charging: battery.charging,
        level: battery.level,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
      };
    } catch (e) {
      return null;
    }
  }
  return null;
}

function getNetworkInfo(): NetworkInfo | null {
  if ("connection" in navigator) {
    const conn = (navigator as any).connection;
    return {
      effectiveType: conn.effectiveType,
      downlink: conn.downlink,
      rtt: conn.rtt,
      saveData: conn.saveData,
    };
  }
  return null;
}
function toHex(arrayBuffer: ArrayBuffer): string {
  return Array.prototype.map
    .call(new Uint8Array(arrayBuffer), (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
}
