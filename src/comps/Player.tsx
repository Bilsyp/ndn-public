import { useEffect, useState } from "react";
import shaka from "shaka-player/dist/shaka-player.ui.js";
import "shaka-player/dist/controls.css";
import { Myparams, labels } from "@/params";
import { NdnPlugin, formatInt } from "@/lib/shaka-ndn-plugin";
import Connection from "./Connection";
import Stats from "./Stats";
import OptionsButton from "./OptionsButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Accordions from "./Accordion";
import { useQueue } from "@uidotdev/usehooks";
import { usePapaParse } from "react-papaparse";
import Skeletons from "./Skeleton";
interface Player {
  load(url: string): void;
  getStats(): Myparams | undefined;
}
type UnparseObject = /*unresolved*/ any;

const Player = () => {
  const [player, setPlayer] = useState<shaka.Player | null | undefined>(
    undefined
  );
  const [content, setContent] = useState<string>("");
  const [loadContent, setLoadContent] = useState<boolean>(false);
  const [hasErrorloadVideo, setHasErrorLoadVideo] = useState<boolean | string>(
    false
  );
  const [hasErrorRecord, setHasErrorRecord] = useState<boolean | string>(false);
  const { add, clear, queue } = useQueue<Myparams>([]);
  const { jsonToCSV } = usePapaParse();

  const handlePlay = async (): Promise<void> => {
    try {
      setLoadContent(true);

      await player?.load(`ndn:/itb/video/${content}/playlist.mpd`);
      clear();
      setHasErrorLoadVideo(false);
      setLoadContent(false);
      setHasErrorRecord(false);
    } catch (error: unknown | any) {
      setHasErrorLoadVideo(true);
      setHasErrorRecord(true);
      setLoadContent(false);
    }
  };

  const handleTimeUpdate = async (): Promise<void> => {
    const stats: any = player?.getStats();
    if (stats) {
      const {
        rtte: { sRtt, rto },
      } = NdnPlugin.getInternals();
      labels.forEach((item) => {
        const element: Element | null = document.querySelector(`#${item}`);
        if (element) {
          element.textContent =
            item == "rtt"
              ? formatInt(sRtt)
              : item == "rto"
              ? formatInt(rto)
              : item == "estimatedBandwidth"
              ? formatInt(stats["estimatedBandwidth"] / 1024)
              : item == "streamBandwidth"
              ? formatInt(stats["streamBandwidth"] / 1024)
              : item == "loadLatency"
              ? formatInt(stats["loadLatency"] * 1000)
              : formatInt(stats[item]);
        }
      });
      add({
        width: stats["width"],
        height: stats["height"],
        loadLatency: formatInt(stats["loadLatency"] * 1000),
        streamBandwidth: formatInt(stats["streamBandwidth"] / 1024),
        estimatedBandwidth: formatInt(stats["estimatedBandwidth"] / 1024),
        decodedFrames: formatInt(stats["decodedFrames"]),
        droppedFrames: formatInt(stats["droppedFrames"]),
        bufferingTime: formatInt(stats["bufferingTime"]),
        playTime: formatInt(stats["playTime"]),
        pauseTime: formatInt(stats["pauseTime"]),
        rtt: formatInt(sRtt),
        rto: formatInt(rto),
      });
    }
  };

  const handleValue = (selected: string) => setContent(selected);
  const handleRecord = (): void => {
    const obj: string | unknown[] | UnparseObject = JSON.stringify(queue);
    const csv: string = jsonToCSV(obj);
    const blob: Blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url: string = URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement("a");
    a.href = url;
    a.download = "Record_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    async function initApp(): Promise<void> {
      shaka.polyfill.installAll();
      shaka.net.NetworkingEngine.registerScheme("ndn", NdnPlugin);

      const localPlayer = new shaka.Player();
      const videoContainer: any = document.getElementById("video-container");
      const video: any = document.getElementById("video");

      await localPlayer.attach(video);

      const ui = new shaka.ui.Overlay(localPlayer, videoContainer, video);

      const controls: any = ui.getControls();

      const player: any = controls.getPlayer();
      setPlayer(player);
      ui.configure({
        castReceiverAppId: "07AEE832",
        castAndroidReceiverCompatible: true,
      });
    }
    initApp();
  }, []);
  return (
    <section className="streamvideo px-1 lg:px-5 ">
      <Connection>
        <div className="text-[#FEF4F4] my-20  lg:grid grid-cols-2 overflow-clip">
          <div className="video-conteiner">
            <div
              data-shaka-player-container
              id="video-container"
              className=" w-full border-[2px] rounded-md border-gray-500 "
              data-shaka-player-cast-receiver-id="07AEE832"
            >
              <video
                onTimeUpdate={handleTimeUpdate}
                height={519}
                data-shaka-player
                id="video"
                className="w-full "
              ></video>
            </div>

            {hasErrorloadVideo && (
              <Alert variant="destructive" className="my-3 text-red-500">
                <AlertTitle>Network Error</AlertTitle>
                <AlertDescription>
                  Unable to establish a connection. Please check your network
                  settings.
                </AlertDescription>
              </Alert>
            )}
            {hasErrorRecord && (
              <Skeletons>
                <Alert
                  className="my-3   text-yellow-500
      
      )]"
                >
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    If you encounter this warning, please attempt to load the
                    video.
                  </AlertDescription>
                </Alert>
              </Skeletons>
            )}
          </div>

          <div className="stat lg:px-10">
            <OptionsButton
              handleRecord={handleRecord}
              loadContent={loadContent}
              handlePlay={handlePlay}
              handleValue={handleValue}
            />
            <Stats />
            <Accordions />
          </div>
        </div>
      </Connection>
    </section>
  );
};

export default Player;
