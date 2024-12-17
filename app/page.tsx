import SubwayIcon from './components/SubwayIcon'
import { TrainStatus } from './types'
import { getFullBackendURL, TRAIN_ORDER } from './utils/helpers'

async function getData(): Promise<TrainStatus[]> {
  const response = await fetch(getFullBackendURL() + '/api/status', { next: { revalidate: 30 } })
  if (!response.ok) {
    return []
  }
  return await response.json()
}

export default async function Page() {
  const subways = await getData()
  // Reorder subways into logical order
  const all_subways = TRAIN_ORDER.map(train => {
    // const emptyResponse = getEmptyAlertsResponse(train)
    const normalStatus: TrainStatus = { train, status: 'normal' }
    return subways.find(subway => subway.train == train) ?? normalStatus
  })
  return (
    <>
      <h1 className="mb-4 self-start text-2xl">Routes</h1>
      <div className="grid grid-cols-4 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {all_subways.map((subway, key) => (
          <SubwayIcon
            key={key}
            train={subway.train}
            status={subway.status}
          />
        ))}
      </div>
    </>
  )
}
