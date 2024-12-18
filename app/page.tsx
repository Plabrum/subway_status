import Header from './components/Header'
import SubwayIcon from './components/SubwayIcon'
import { TrainStatus } from './types'
import { getFullBackendURL, TRAIN_ORDER } from './utils/helpers'

async function getData(): Promise<TrainStatus[]> {
  const response = await fetch(getFullBackendURL() + '/api/status', { next: { revalidate: 60 } })
  if (!response.ok) {
    return []
  }
  return await response.json()
}

export default async function Page() {
  const subways = await getData()
  const all_subways = TRAIN_ORDER.map(train => {
    const normalStatus: TrainStatus = { train, status: 'normal' }
    return subways.find(subway => subway.train == train) ?? normalStatus
  })
  return (
    <div className="">
      <Header className="" />
      {/* <div className=""> */}
      <h1 className="mx-4 mb-4 self-start text-xl font-bold">Routes</h1>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-4 sm:gap-4 lg:grid-cols-8">
        {all_subways.map((subway, key) => (
          <SubwayIcon
            key={key}
            train={subway.train}
            status={subway.status}
          />
        ))}
        {/* </div> */}
      </div>
    </div>
  )
}
