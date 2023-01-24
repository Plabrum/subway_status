import { train_colors } from "@/Utils/helpers";
import { useState, useEffect, Suspense } from "react";
import ReportList, {
  emptyTrainReport,
  IncomingType,
  TrainListProps,
} from "./ReportList";

export function TrainList() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<IncomingType[]>(emptyTrainReport());

  useEffect(() => {
    fetch(
      "https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-9eca26dd-80e1-48a4-9992-8f4f60a7accb/subway_status_api/reports"
      //   { next: { revalidate: 10 } }
    )
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  // const data: IncomingType[] = rawdata;
  return (
    <div className="">
      <div className="grid grid-cols-5 sm:gap-x-20 sm:gap-y-2 gap-y-1">
        <div className="col-span-1 ">
          <h1 className=" sm:text-3xl text-2xl text-center">Trains</h1>
        </div>
        <div className="col-span-4 ">
          <h1 className=" sm:text-3xl text-2xl text-center">Current Reports</h1>
        </div>

        {data.map((element, index) => {
          const train: string = element.train;
          const reports: TrainListProps = element.all_reports;
          const trainStyle: string = train_colors(train);
          return (
            <>
              <div className="col-span-1 flex items-center text-center">
                <h1
                  className={`inline-block sm:text-3xl text-xl px-4 py-2 border-2 mx-auto rounded-full ${trainStyle}`}
                >
                  {train}
                </h1>
              </div>
              <div className="col-span-4 flex items-center sm:pl-8 pl-2">
                <ReportList
                  reports={reports}
                  isLoading={isLoading}
                  pclassName={"my-2"}
                />
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
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
