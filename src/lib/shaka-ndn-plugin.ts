import { Endpoint } from "@ndn/endpoint";
import { FileMetadata } from "@ndn/fileserver";
import { Name } from "@ndn/packet";
import { retrieveMetadata } from "@ndn/rdr";
import { fetch, RttEstimator, TcpCubic } from "@ndn/segmented-object";
import PQueue from "p-queue";
import hirestime from "hirestime";
import shaka from "shaka-player";
// # Shaka NDN Plugin By Yoursunny
import { connectToRouter } from "@ndn/autoconfig";
import { H3Transport } from "@ndn/quic-transport";

const fwHints: any = [];
async function connRouter(pref: string): Promise<any> {
  try {
    const { face } = await connectToRouter(pref, {
      H3Transport,
      testConnection: false,
    });

    return face;
  } catch (error: any | unknown) {
    throw new Error(error);
  }
}
// async function coonNetwork(): Promise<any> {
//   try {
//     const face = await connectToNetwork({
//       H3Transport,
//       preferH3: true,
//       fallback: ["suns.cs.ucla.edu", "vnetlab.gcom.di.uminho.pt"],
//       testConnectionTimeout: 6000,
//     });
//     return face;
//   } catch (error: any | unknown) {
//     throw new Error(error);
//   }
// }
export async function connection(pref: string): Promise<any> {
  try {
    const router = await connRouter(pref);

    return router;
  } catch (error: any | unknown) {
    throw new Error(error);
  }
}
function findFwHint(name: string | object): object | undefined {
  for (const [prefix, fwHint] of fwHints) {
    if (prefix.isPrefixOf(name)) {
      return { fwHint };
    }
  }
  return undefined;
}
const getNow = hirestime();

export class VideoFetcher {
  queue: PQueue;
  rtte: RttEstimator;
  ca: TcpCubic;

  constructor() {
    this.queue = new PQueue({ concurrency: 4 });
    this.rtte = new RttEstimator({ maxRto: 10000 });
    this.ca = new TcpCubic({ c: 0.1 });
  }
}

export class FileFetcher {
  vf: any; // Gantilah any dengan tipe yang sesuai
  uri: string;
  requestType: string;
  name: Name;
  abort: AbortController;
  endpoint: Endpoint;
  constructor(vf: any, uri: string, requestType: string) {
    this.vf = vf;
    this.uri = uri;
    this.requestType = requestType;
    this.name = new Name(uri.replace(/^ndn:/, ""));

    this.abort = new AbortController();
    this.endpoint = new Endpoint({
      modifyInterest: findFwHint(this.name),
      retx: 10,
      signal: this.abort.signal,
    });
  }

  async retrieve() {
    const metadata = await retrieveMetadata(this.name, FileMetadata, {
      endpoint: this.endpoint,
    });
    const t0 = getNow();

    const payload = await fetch(metadata.name, {
      endpoint: this.endpoint,
      rtte: this.vf.rtte,
      ca: this.vf.ca,
      retxLimit: 4,
      estimatedFinalSegNum: metadata.lastSeg,
    });
    const timeMs = getNow() - t0;
    return {
      uri: this.uri,
      name: this.name,
      originalUri: this.uri,
      data: payload,
      headers: {
        status: 200,
        "Content-Type": this.requestType,
      },
      timeMs,
    };
  }

  handleError() {
    if (this.abort.signal.aborted) {
      return shaka.util.AbortableOperation.aborted();
    }
    throw new shaka.util.Error(
      shaka.util.Error.Severity.RECOVERABLE,
      shaka.util.Error.Category.NETWORK,
      shaka.util.Error.Code.BAD_HTTP_STATUS,
      this.uri,
      503,
      null,
      {},
      this.requestType
    );
  }
}

let vf: any;

/** shaka.extern.SchemePlugin for ndn: scheme. */
export function NdnPlugin(uri: string, requestType: string) {
  const ff = new FileFetcher(vf, uri, requestType);
  return new shaka.util.AbortableOperation(
    vf.queue.add(async () => {
      try {
        return await ff.retrieve();
      } catch (err) {
        ff.handleError();
      }
    }),
    (): any => ff.abort.abort()
  );
}
export function formatInt(n: any): any {
  return Number.isNaN(n) ? "?" : `${Math.round(n)}`;
}
NdnPlugin.reset = () => {
  vf = new VideoFetcher();
};

NdnPlugin.getInternals = () => vf;

NdnPlugin.reset();
