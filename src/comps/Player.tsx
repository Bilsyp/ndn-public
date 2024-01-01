import { useEffect, useRef, useState } from "react";
import shaka from "shaka-player/dist/shaka-player.ui.js";
import "shaka-player/dist/controls.css";
import { Myparams, labels } from "@/params";
import { NdnPlugin, formatInt } from "@/lib/shaka-ndn-plugin";
import Connection from "./Connection";
import Stats from "./Stats";
import OptionsButton from "./OptionsButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Accordions from "./Accordion";
import { useQueue, useMediaQuery } from "@uidotdev/usehooks";
import { usePapaParse } from "react-papaparse";
import Skeletons from "./Skeleton";
interface Player {
  load(url: string): void;
  getStats(): Myparams | undefined;
}
type UnparseObject = /*unresolved*/ any;

const Player = () => {
  const [player, setPlayer] = useState<undefined | Player>(undefined);
  const [content, setContent] = useState<string>("");
  const [loadContent, setLoadContent] = useState<boolean>(false);
  const [hasErrorloadVideo, setHasErrorLoadVideo] = useState<null | string>(
    null
  );
  const [hasErrorRecord, setHasErrorRecord] = useState<boolean | string>(false);
  const { add, clear, queue } = useQueue<Myparams>([]);
  const video = useRef<null>(null);
  const videoContainer = useRef<null>(null);
  const isSmallDevice = useMediaQuery("only screen and (max-width : 468px)");
  const { jsonToCSV } = usePapaParse();

  const handlePlay = async (): Promise<void> => {
    try {
      setLoadContent(true);

      await player?.load(`ndn:/itb/video/${content}/playlist.mpd`);
      clear();
      setHasErrorLoadVideo(null);
      setLoadContent(false);
    } catch (error: unknown | any) {
      setHasErrorLoadVideo(error.message);
      setLoadContent(false);
    }
  };

  const handleTimeUpdate = async (): Promise<void> => {
    try {
      const stats: any = player?.getStats();
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
    } catch (error: unknown | any) {
      setHasErrorRecord(error.message);
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
      await localPlayer.attach(video.current);

      const ui = new shaka.ui.Overlay(
        localPlayer,
        videoContainer.current,
        video.current
      );

      const controls = ui.getControls();

      const player = controls.getPlayer();
      setPlayer(player);
      ui.configure({
        castReceiverAppId: "07AEE832",
        castAndroidReceiverCompatible: true,
      });
    }
    initApp();
  }, []);
  return (
    <section className="streamvideo px-4 lg:px-5 ">
      {isSmallDevice && <Accordions />}
      <Connection>
        <div className="text-[#FEF4F4] my-20  lg:grid grid-cols-2 overflow-clip">
          <div className="video-conteiner">
            <div
              data-shaka-player-container
              className=" w-full border-[2px] rounded-md border-gray-500 "
              ref={videoContainer}
              data-shaka-player-cast-receiver-id="07AEE832"
            >
              <video
                onTimeUpdate={handleTimeUpdate}
                height={519}
                data-shaka-player
                ref={video}
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
            {!hasErrorRecord && (
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
            {!isSmallDevice && <Accordions />}
          </div>
        </div>
      </Connection>
    </section>
  );
};

export default Player;
