import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { useCSVReader } from "react-papaparse";
import { parameter } from "@/lib/parameter";
import { useEffect, useState } from "react";
export function Statistics() {
  const { CSVReader } = useCSVReader();
  const [config, setConfig] = useState([]);
  const [doc, setDoc] = useState([]);
  const convert = (arr, keys) =>
    arr.map((item) => {
      const obj = {};
      keys.forEach((key, index) => {
        obj[key] = item[index];
      });
      return obj;
    });
  const handleUploadAccepted = (results, acceptedFile) => {
    const labels = parameter.map((item) => item.content);

    const result = convert(results.data.slice(1), labels);

    let object = [];

    for (let index in result) {
      object.push({
        x: result[index].playTime,
        y: result[index].streamBandwidth,
      });
    }
    const uniqueArrayOfObjects = object.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.x === value.x && t.y === value.y)
    );

    setConfig(uniqueArrayOfObjects);
    setDoc([...doc, uniqueArrayOfObjects]);
    // add([...result]);
    // setTitle((prev) => {
    //   return [...prev, acceptedFile.name];
    // });
  };

  return (
    <main className="p-6 md:p-10">
      <CSVReader onUploadAccepted={handleUploadAccepted}>
        {({ getRootProps, ProgressBar }) => (
          <>
            <div className="my-5 flex flex-wrap gap-7">
              <button className="btn" type="button" {...getRootProps()}>
                Browse file
              </button>
              <button>Remove</button>
            </div>
            <ProgressBar />
          </>
        )}
      </CSVReader>

      <section className="grid grid-cols-2 gap-6 ">
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
              <CardDescription>
                The total revenue generated by the business over the last 6
                months.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {doc.length > 0 ? (
                <LineChart
                  data1={doc[0]}
                  data2={doc[1]}
                  className="  aspect-video"
                />
              ) : (
                ""
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>New Customers</CardTitle>
              <CardDescription>
                The number of new customers acquired over the last 6 months.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart className="aspect-[9/4]" />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Conversion Rate</CardTitle>
              <CardDescription>
                The percentage of visitors that convert into paying customers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart className="aspect-[9/4]" />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Average Order Value</CardTitle>
              <CardDescription>
                The average amount spent per order by customers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart className="aspect-[9/4]" />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

function BarChart(props) {
  return (
    <div {...props}>
      <ResponsiveBar
        data={[
          { name: "Jan", count: 111 },
          { name: "Feb", count: 157 },
          { name: "Mar", count: 129 },
          { name: "Apr", count: 150 },
          { name: "May", count: 119 },
          { name: "Jun", count: 72 },
        ]}
        keys={["count"]}
        indexBy="name"
        margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
        padding={0.3}
        colors={["#2563eb"]}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 4,
          tickPadding: 16,
        }}
        gridYValues={4}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        tooltipLabel={({ id }) => `${id}`}
        enableLabel={false}
        role="application"
        ariaLabel="A bar chart showing data"
      />
    </div>
  );
}

function LineChart(props) {
  return (
    <div {...props}>
      <ResponsiveLine
        data={[
          {
            id: "Desktop",
            data: props.data1 || [{ x: "feb", y: 1 }],
          },
          {
            id: "Mobile",
            data: props.data2 || [{ x: "feb", y: "1" }],
          },
        ]}
        margin={{ top: 10, right: 10, bottom: 40, left: 60 }}
        xScale={{
          type: "point",
        }}
        yScale={{
          type: "linear",
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 5,
          tickPadding: 16,
        }}
        colors={["#2563eb", "#e11d48"]}
        pointSize={6}
        useMesh={true}
        gridYValues={6}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        role="application"
      />
    </div>
  );
}
