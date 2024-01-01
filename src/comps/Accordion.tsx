import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Skeletons from "./Skeleton";
export default function Accordions() {
  return (
    <Skeletons>
      <Accordion
        className="my-6 lg:my-4  text-slate-900 dark:text-white "
        type="single"
        collapsible
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>
            Streaming Video dengan Jaringan Named Data Network (NDN) - Tahap Uji
            Coba
          </AccordionTrigger>
          <AccordionContent>
            Hello, pada halaman ini, kita dapat melakukan streaming video.
            Namun, perlu diperhatikan bahwa video yang tersedia masih terbatas
            karena kami masih dalam tahap uji coba. Saat ini, kami sedang
            mengimplementasikan streaming video melalui jaringan Named Data
            Network. Proses pengiriman dilakukan melalui router, tesbed, atau
            bisa disebut juga server terpusat yang terletak di ITB Bandung
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Cara Kerja</AccordionTrigger>
          <AccordionContent>
            Cara kerjanya sangat sederhana. Anda hanya perlu memilih konten yang
            telah disediakan sebagai. Ketika Anda memilih konten ini, di balik
            layar, klien akan melakukan permintaan video dengan URL:{" "}
            <q>/itb/video/content/playlist.mpd</q>. Untuk memulai pemutaran
            video, cukup klik tombol <q>Load Video</q> dan tunggu prosesnya.
            <br />
            <br />
            noted : Kemungkinan video berhasil untuk diputar saat ini sekitar
            90%
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Perencanaan Berikutnya</AccordionTrigger>
          <AccordionContent>
            <ol className="list-disc flex flex-col gap-8">
              <li>
                - Merancang algoritma ABR adaptif untuk meningkatkan kualitas
                video streaming pada lingkungan jaringan multichannel NDN.
              </li>
              <li>
                - Melakukan evaluasi menyeluruh terhadap performa algoritma ABR
                baru di lingkungan NDN
              </li>
              <li>
                - Menyajikan kesimpulan utama dari penelitian, mencakup temuan
                signifikan terkait dengan kualitas video streaming pada NDN
              </li>
            </ol>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Kesimpulan Tahap 1</AccordionTrigger>
          <AccordionContent>
            Dari hasil analisis, dapat disimpulkan bahwa NDN menunjukkan kinerja
            yang lebih baik dalam aspek latency, responsivitas, dan delay,
            sementara IP unggul dalam proses dekode frame video dan kestabilan
            bandwidth. Meskipun keduanya memiliki kelebihan masing-masing, NDN
            dengan model multichannel memiliki potensi untuk meningkatkan
            performansi di lingkungan jaringan yang lebih kompleks, terutama
            dengan pengembangan algoritma bitrate adaptif yang baru. Dengan
            demikian, implementasi NDN dalam video streaming menawarkan
            alternatif yang menarik, dan penelitian lebih lanjut pada aspek
            routing, buffering, pengelolaan frame dan algoritma Adaptive bitrate
            pada jaringan multichannel dapat meningkatkan daya saingnya
            dibandingkan dengan jaringan IP.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Skeletons>
  );
}
