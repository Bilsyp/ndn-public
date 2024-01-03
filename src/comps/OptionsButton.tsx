import { Button } from "@/components/ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Skeletons from "./Skeleton";
import { Link } from "react-router-dom";
interface OptionsButtonProps {
  handlePlay: () => Promise<void>;
  handleValue: (value: string) => void;
  handleRecord: () => void;
  loadContent?: boolean; // Change 'string' to the actual type of the value
}

export default function OptionsButton({
  handlePlay,
  handleValue,
  loadContent,
  handleRecord,
}: OptionsButtonProps) {
  return (
    <Skeletons>
      <div className="optionButtons dark:text-white flex justify-center lg:justify-start  flex-wrap gap-5 my-4 lg:my-1 lg:mb-8">
        <Select onValueChange={handleValue}>
          <SelectTrigger className="w-[180px] text-slate-800 dark:text-white">
            <SelectValue className="" placeholder="Content" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="autobots">Autobots</SelectItem>
            <SelectItem value="spider">Spider</SelectItem>
            <SelectItem value="linux">Linux</SelectItem>
            <SelectItem value="belajar">Belajar NDN</SelectItem>
            <SelectItem value="wpu">Wpu</SelectItem>
            <SelectItem value="programming">Programming</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handlePlay}>
          {loadContent ? (
            <div className="flex justify-center items-center gap-3">
              <span>Loading to load video </span>
              <AiOutlineLoading3Quarters className="animate-spin" />
            </div>
          ) : (
            "Load Video"
          )}
        </Button>
        <Button onClick={handleRecord}>Record Video</Button>
        <Link to={"/graphic"}>
          <Button>Chart Video</Button>
        </Link>
      </div>
    </Skeletons>
  );
}
