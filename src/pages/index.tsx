import { TrainList } from "@/Components/TrainList";
import Head from "next/head";
import Image from "next/image";

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
      <div className="bg-black">
        <main className="text-white font-bold">
          <h1 className="text-center text-4xl p-8 font-mono">
            Instant MTA Subway Information
          </h1>
          <div className="w-3/4 mx-auto">
            <TrainList />
          </div>
        </main>
      </div>

      <div className="my-8">
        <h3 className="text-gray-300 text-center">
          Simple App by Phil Labrum - 2023
        </h3>
      </div>
    </>
  );
}
