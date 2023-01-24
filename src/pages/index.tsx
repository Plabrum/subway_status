import { useState, useEffect, Suspense } from "react";
import Head from "next/head";
import Image from "next/image";

function Loading() {
  return (
    <div className="h-54 flex">
      <h1>Loading...</h1>
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

function parse_time(isotime: string): string {
  interface MMType<string> {
    [Key: string]: string;
  }
  const MM: MMType = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec",
  };

  const month = MM[isotime.slice(5, 7)];
  const day = Number(isotime.slice(8, 10));
  const time = isotime.slice(11, 16);
  return `${month}  ${day} ${time}`;
}

function Trains() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(
      "https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-9eca26dd-80e1-48a4-9992-8f4f60a7accb/subway_status/times"
      // { next: { revalidate: 10 } }
    )
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);
  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No train data found</p>;

  return (
    <div className="">
      <div className="grid grid-cols-12 text-center text-3xl font-mono m-8">
        <h1 className="col-span-2">Trains</h1>
        <h1 className="col-span-10">Current Reports</h1>
      </div>

      {Object.entries(data).map(([key, values]) => {
        return (
          <div key={key} className="grid grid-cols-12">
            <div className="col-span-2 text-center items-center">
              <h1 className="inline-block text-3xl px-4 py-2 border border-2 rounded-full m-2">
                {key}
              </h1>
            </div>
            <div className="col-span-10 align-middle">
              {values.breaking.length == 0 ? (
                values.current.length == 0 ? (
                  <div>
                    <h1 className="text-green-500">Service Good</h1>
                  </div>
                ) : (
                  values.current.map((val, index) => {
                    var start_time = parse_time(val.start);
                    const report = val.report;
                    return (
                      <div key={index}>
                        <h1 className="text-white">
                          <span className="text-blue-300 mr-2">
                            {start_time}
                          </span>
                          {report}
                        </h1>
                      </div>
                    );
                  })
                )
              ) : (
                values.breaking.map((val, index) => {
                  var start_time = parse_time(val.start);
                  const report = val.report;
                  return (
                    <div key={index}>
                      <h1 className="text-white">
                        <span className="text-red-300 mr-2">{start_time}</span>
                        {report}
                      </h1>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Subway Status</title>
        <meta
          name="description"
          content="A simple site to get MTA Subway informtion"
        />
      </Head>
      <body className="bg-black h-screen w-screen">
        <main className="text-white font-bold">
          <h1 className="text-center text-2xl p-8">
            Instant MTA Subway Information
          </h1>
          <div className="w-3/4 mx-auto">
            <Trains />
          </div>
        </main>
      </body>
    </>
  );
}
