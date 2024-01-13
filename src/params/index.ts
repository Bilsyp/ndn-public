export interface Myparams {
  width: number | string;
  height: number | string;
  loadLatency: number | string;
  streamBandwidth: number | string;
  estimatedBandwidth: number | string;
  decodedFrames: number | string;
  droppedFrames: number | string;
  bufferingTime: number | string;
  playTime: number | string;
  pauseTime: number | string;
  rtt: number | string;
  rto: number | string;
  delay?: number | string;
}

export const labels: string[] = [
  "height",
  "width",
  "loadLatency",
  "streamBandwidth",
  "estimatedBandwidth",
  "decodedFrames",
  "droppedFrames",
  "bufferingTime",
  "playTime",
  "pauseTime",
  "rtt",
  "rto",
  "delay",
];
async function pingServer(): Promise<number | string> {
  try {
    const startTime = new Date().getTime();

    const is = await fetch("https://testbed-ndn-rg.stei.itb.ac.id/stream/ping");
    const res = await is.json();
    console.log(res);
    const endTime = new Date().getTime();
    const responseTime = endTime - startTime;

    return responseTime;
  } catch (error) {
    console.error("Ping failed:", error);
    return "Ping failed";
  }
}

export async function measureRTTAndRTO(): Promise<number | string> {
  try {
    const responseTime = await pingServer();

    // You can also calculate RTO based on the RTT if needed.
    return responseTime;
  } catch (error) {
    return "tset";
  }
}
