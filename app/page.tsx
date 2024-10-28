import { TrainList } from 'app/components/TrainList'

export default function Home() {
  return (
    <div className="bg-gray-900">
      <main className="font-bold text-white">
        <h1 className="p-8 text-center font-mono text-4xl">Instant MTA Subway Information</h1>
        <div className="">
          <TrainList />
        </div>
      </main>
      <div className="my-8">
        <h3 className="text-center text-gray-300">App by Phil Labrum - 2023</h3>
      </div>
    </div>
  )
}
