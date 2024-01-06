import { ChartData } from "chart.js";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // ADD THIS
import { useState } from "react";
import { useCSVReader } from "react-papaparse";
import { labels } from "@/params";
import { useQueue } from "@uidotdev/usehooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
function Chart() {
  const { CSVReader } = useCSVReader();
  const { add, first, last, queue, remove } = useQueue<
    string[] | undefined | unknown[] | any
  >([]);
  const [title, setTitle] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("");

  const convert = (arr: [], keys: string[]) =>
    arr.map((item) => {
      const obj: Record<string, any> = {};
      keys.forEach((key: string, index: number) => {
        obj[key] = item[index];
      });
      return obj;
    });
  const persamaa = () => {
    const firstLength = Array.isArray(first) ? first?.length : queue.length;
    const LastLength = Array.isArray(last) ? last?.length : queue.length;
    const minLength = Math.min(firstLength, LastLength);
    return minLength;
  };

  const datax: ChartData<"line"> = {
    labels: Array.from({ length: persamaa() }, (_, index) => index + 1),
    datasets: [
      {
        label: `${title[0]}`,
        data: Array.isArray(first)
          ? [...(first?.map((items) => items?.[selected]) || [])]
          : [],
      },
      {
        label: `${title[1]}`,
        data: Array.isArray(last)
          ? [...(last?.map((items) => items?.[selected]) || [])]
          : [],
      },
    ],
  };
  const handleUploadAccepted = (results: any, acceptedFile: any) => {
    const result = convert(results.data.slice(1), labels);

    add([...result]);
    setTitle((prev) => {
      return [...prev, acceptedFile.name];
    });
  };
  const handleParams = (result: string) => setSelected(result);
  const handleRemove = () => {
    title.splice(title.length - 1, 1);
    remove();
  };
  return (
    <div className="containers px-3">
      <CSVReader onUploadAccepted={handleUploadAccepted}>
        {({ getRootProps, ProgressBar }: any) => (
          <>
            <div className="my-5 flex flex-wrap gap-7">
              <Button
                disabled={queue.length >= 2 ? true : false}
                type="button"
                {...getRootProps()}
              >
                Browse file
              </Button>
              <Button onClick={handleRemove}>Remove</Button>
              <Select onValueChange={handleParams}>
                <SelectTrigger className="w-[180px] text-slate-800 dark:text-white">
                  <SelectValue placeholder="Params" />
                </SelectTrigger>
                <SelectContent>
                  {labels.map((item) => {
                    return (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <ProgressBar />
          </>
        )}
      </CSVReader>
      <div className="files flex gap-4 ">
        {title.map((item) => (
          <Card>
            <CardHeader>
              <CardTitle className="text-[0.89rem]">{item}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="lg:container my-3 lg:w-[70%]">
        <Line className="" data={datax}></Line>
      </div>
    </div>
  );
}

export default Chart;
