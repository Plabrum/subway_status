import AlertReport from '@/app/components/AlertReport'
import CollapsableReportList from '@/app/components/CollapsableReportList'
import SubwayIcon from '@/app/components/SubwayIcon'
import { AlertsResponse } from '@/app/types'

import { getFullBackendURL, ROLLOUT, TRAIN_ORDER } from '@/app/utils/helpers'

export async function getSubwayInfo(id: string): Promise<AlertsResponse | null> {
  const response = await fetch(getFullBackendURL() + `/api/alerts/${id}`, { next: { revalidate: 30 } })
  if (!response.ok) {
    return null
  }
  return await response.json()
}

export async function generateStaticParams() {
  return TRAIN_ORDER.map(train => ({
    id: train
  }))
}

export default async function SubwayPage({ params }: { params: { id: string } }) {
  const routeInfo = await getSubwayInfo(params.id)

  return (
    <div className="flex w-full flex-col gap-y-4">
      <div className="mr-auto flex flex-row items-center gap-x-4">
        <h1 className="text-2xl font-bold">Subway Line</h1>
        <SubwayIcon
          train={params.id}
          className="h-10 text-2xl"
        />
      </div>
      {routeInfo?.breaking && routeInfo.breaking.length > 0 && (
        <h3 className="text-xl font-bold">Breaking Notices ({routeInfo.breaking.length})</h3>
      )}
      {routeInfo?.breaking?.map((report, index) => (
        <AlertReport
          key={index}
          report={report}
        />
      ))}
      {routeInfo?.current && routeInfo.current.length > 0 && (
        <h3 className="text-xl font-bold">Active Notices ({routeInfo.current.length})</h3>
      )}
      {routeInfo?.current?.map((report, index) => (
        <AlertReport
          key={index}
          report={report}
        />
      ))}
      {ROLLOUT.shouldDisplayPast && routeInfo?.past && (
        <h3 className="text-xl font-bold">Past Notices ({routeInfo?.past.length})</h3>
      )}
      {ROLLOUT.shouldDisplayPast &&
        routeInfo?.past?.map((report, index) => (
          <AlertReport
            key={index}
            report={report}
          />
        ))}
      {routeInfo?.future && routeInfo.future.length > 0 && (
        <CollapsableReportList
          title="Future Notices"
          reportArray={routeInfo?.future}
        />
      )}
    </div>
  )
}
