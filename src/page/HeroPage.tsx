import { Button } from "@/components/ui/button";
import Skeletons from "@/comps/Skeleton";
import { Link } from "react-router-dom";

const HeroPage = () => {
  return (
    <section className="flex justify-center items-center h-[90vh]">
      <div className="container mx-auto p-3 dark:text-white  lg:mx-0 lg:max-w-[70%] ">
        <Skeletons>
          <h1 className="title text-2xl font-semibold lg:text-4xl">
            Eksperimen Named Data Networking: Meningkatkan Streaming Video
          </h1>
        </Skeletons>
        <Skeletons>
          <p className="dark:text-white py-6 lg:text-xl   font-Poppins">
            Jelajahi dunia baru streaming online dengan web kami yang
            memanfaatkan Named Data Networking (NDN). Rasakan keunggulan
            teknologi terdepan dalam pengalaman streaming yang lebih cepat,
            handal, dan aman. Temukan era baru hiburan digital dengan web
            streaming berbasis NDN: Terhubung, Cepat, Tanpa Batas!
          </p>
        </Skeletons>
        <Skeletons>
          <Link to={"/streamvideo"}>
            <Button className=" py-4">Streaming</Button>
          </Link>
        </Skeletons>
      </div>
    </section>
  );
};
export default HeroPage;
