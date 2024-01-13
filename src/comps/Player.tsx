import { useEffect, useState } from "react";
import { NdnPlugin, formatInt } from "@/lib/shaka-ndn-plugin";
import { Myparams, labels } from "@/params";
import { usePapaParse } from "react-papaparse";
import { useQueue } from "@uidotdev/usehooks";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import shaka from "shaka-player/dist/shaka-player.ui.js";
import "shaka-player/dist/controls.css";
import Connection from "./Connection";
import Stats from "./Stats";
import OptionsButton from "./OptionsButton";
import Accordions from "./Accordion";
import Skeletons from "./Skeleton";

const Player = () => {
  const [player, setPlayer] = useState<shaka.Player | null>()!;
  const { add, clear, queue } = useQueue<Myparams>([]);
  const [content, setContent] = useState<string>("");
  const [loadContent, setLoadContent] = useState<boolean>(false);
  const [hasErrorloadVideo, setHasErrorLoadVideo] = useState<boolean | string>(
    false
  );
  const [hasErrorRecord, setHasErrorRecord] = useState<boolean | string>(false);
  const { jsonToCSV } = usePapaParse();
  const handleValue = (selected: string) => setContent(selected);

  const handleLoadVideo = async (): Promise<void> => {
    try {
      setLoadContent(true);
      await player?.load(`ndn:/itb/video/${content}/playlist.mpd`);
      clear();
      setLoadContent(false);
      setHasErrorLoadVideo(false);
      setHasErrorRecord(false);
    } catch (error) {
      setHasErrorLoadVideo(true);
      setHasErrorRecord(true);
      setLoadContent(false);
    }
  };
  const handleRecord = (): void => {
    const obj: unknown[] | any = JSON.stringify(queue);
    const csv = jsonToCSV(obj);
    const blob: Blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url: string = URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement("a");
    a.href = url;
    a.download = "Record_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const handleTimeUpdate = () => {
    const stats: shaka.extern.Stats | any = player?.getStats();
    if (stats) {
      const {
        rtte: { sRtt, rto },
      } = NdnPlugin.getInternals();

      const delay =
        stats?.loadLatency + stats?.streamBandwidth / stats?.estimatedBandwidth;

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
              : item == "delay"
              ? formatInt(delay * 1000)
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
        delay: formatInt(delay * 1000),
      });
    }
  };
  useEffect(() => {
    async function initPlayer() {
      const video: HTMLMediaElement | any = document.getElementById("video");

      const videoContainer: HTMLElement =
        document.getElementById("video-container")!;

      const player: shaka.Player = new shaka.Player();
      await player.attach(video, true);

      const ui: shaka.ui.Overlay = new shaka.ui.Overlay(
        player,
        videoContainer,
        video
      );
      const controls: shaka.ui.Controls = ui.getControls()!;

      const players = controls?.getPlayer();
      setPlayer(players);
      ui.configure({
        // Set the castReceiverAppId
        castReceiverAppId: "07AEE832",
        // Enable casting to native Android Apps (e.g. Android TV Apps)
        castAndroidReceiverCompatible: true,
        seekBarColors: {
          base: "rgba(255, 255, 255, 0.3)",
          buffered: "rgba(255, 255, 255, 0.54)",
          played: "red",
        },
      });
    }
    function initApp() {
      if (shaka.Player.isBrowserSupported()) {
        // Everything looks good!
        shaka.polyfill.installAll();
        shaka.net.NetworkingEngine.registerScheme("ndn", NdnPlugin);
        initPlayer();
      } else {
        // This browser does not have the minimum set of APIs we need.
        console.error("Browser not supported!");
      }
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
    
    )}"
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
              handlePlay={handleLoadVideo}
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
