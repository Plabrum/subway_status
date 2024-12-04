import { TrainList } from 'app/components/TrainList'
import { components } from './types' // Adjust the path to where your generated types are located
import { getFullBackendURL } from './utils/helpers'

type AlertsResponse = components['schemas']['AlertsResponse']

async function getData(): Promise<AlertsResponse[]> {
  const response = await fetch(getFullBackendURL() + '/api/alerts', { next: { revalidate: 600 } })
  if (!response.ok) {
    return []
  }
  return await response.json()
}

export default async function Page() {
  const data = await getData() // Add type here
  return (
    <div className="h-screen bg-gray-900">
      <main className="font-bold text-white">
        <h1 className="p-8 text-center font-mono text-4xl">Instant MTA Subway Information</h1>
        <div className="">
          <TrainList alerts={data} />
        </div>
      </main>
      <div className="my-8">
        <h3 className="text-center text-gray-300">App by Phil Labrum - 2023</h3>
      </div>
    </div>
  )
}
