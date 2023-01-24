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
      <body className="bg-black h-screen w-screen">
        <main className="text-white font-bold">
          <h1 className="text-center text-2xl p-8">
            Instant MTA Subway Information
          </h1>
          <div className="w-3/4 mx-auto">
            <TrainList />
          </div>
        </main>
      </body>
    </>
  );
}
