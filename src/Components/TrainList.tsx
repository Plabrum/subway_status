import { train_colors } from "@/Utils/helpers";
import { useState, useEffect, Suspense } from "react";
import ReportList, { IncomingType, TrainListProps } from "./ReportList";

function Loading() {
  return (
    <div className="h-54 flex">
      <h1>Loading...</h1>
    </div>
  );
}

export function TrainList() {
  const [rawdata, setRawData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(
      "https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-9eca26dd-80e1-48a4-9992-8f4f60a7accb/subway_status_api/reports"
      // { next: { revalidate: 10 } }
    )
      .then((res) => res.json())
      .then((rawdata) => {
        setRawData(rawdata);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!rawdata) return <p>No train data found</p>;
  else {
    const data: IncomingType[] = rawdata;
    return (
      <div className="">
        <div className="grid grid-cols-12 text-center text-3xl font-mono m-8">
          <h1 className="col-span-2">Trains</h1>
          <h1 className="col-span-10">Current Reports</h1>
        </div>

        {data.map((element, index) => {
          const train: string = element.train;
          const reports: TrainListProps = element.all_reports;
          const trainStyle: string = train_colors(train);
          return (
            <div key={index} className="grid grid-cols-12">
              <div className="col-span-2 text-center items-center">
                <h1
                  className={`inline-block text-3xl px-4 py-2 border border-2 rounded-full m-2 ${trainStyle}`}
                >
                  {train}
                </h1>
              </div>
              <div className="col-span-10 align-middle">
                <ReportList
                  breaking={reports.breaking}
                  current={reports.current}
                  future={reports.future}
                  past={reports.past}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

// function Trains2() {
//   const [data, setData] = useState(null);
//   const [isLoading, setLoading] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     fetch(
//       "https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-9eca26dd-80e1-48a4-9992-8f4f60a7accb/subway_status/times",
//       { next: { revalidate: 10 } }
//     )
//       .then((res) => res.json())
//       .then((data) => {
//         setData(data);
//         setLoading(false);
//       });
//   }, []);
//   console.log(data);
//   if (isLoading) return <p>Loading...</p>;
//   if (!data) return <p>No train data found</p>;

//   return (
//     <div className="grid grid-cols-12 place-items-center">
//       <Suspense fallback={<Loading />}>
//         <div className="">
//           {Object.values(data).forEach((key, index) => {})}
//         </div>
//       </Suspense>
//     </div>
//   );
// }
