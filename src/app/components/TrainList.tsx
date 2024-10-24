'use client'
import { train_colors } from '@/Utils/helpers'
import { useEffect, useState } from 'react'
import ReportList, { emptyTrainReport, IncomingType, TrainListProps } from './ReportList'

export function TrainList() {
  const [isLoading, setLoading] = useState(true)
  const [data, setData] = useState<IncomingType[]>(emptyTrainReport())

  useEffect(() => {
    fetch(
      'https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-9eca26dd-80e1-48a4-9992-8f4f60a7accb/subway_status_api/reports',
      { next: { revalidate: 10 } }
    )
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])

  return (
    <div className="sm:w-2/3 sm:mx-auto mx-3">
      <div className="grid grid-cols-5 sm:gap-x-20 gap-x-6 sm:gap-y-2 gap-y-2">
        <div className="col-span-1 mb-4">
          <h1 className=" sm:text-3xl text-2xl text-center">Trains</h1>
        </div>
        <div className="col-span-4 mb-4">
          <h1 className=" sm:text-3xl text-2xl text-center">Current Reports</h1>
        </div>
      </div>

      {data.map((element, index) => {
        const train: string = element.train
        const reports: TrainListProps = element.all_reports
        const trainStyle: string = train_colors(train)
        return (
          <div
            key={index}
            className="grid grid-cols-5 max-md:border max-md:border-gray-500 max-md:rounded-lg sm:my-0 my-4 py-3"
          >
            <div className="col-span-1 flex items-center text-center">
              <h1 className={`inline-block sm:text-3xl text-xl px-4 py-2 border-2 mx-auto rounded-full ${trainStyle}`}>
                {train}
              </h1>
            </div>
            <div className="col-span-4 flex-row my-auto items-center">
              <ReportList reports={reports} isLoading={isLoading} pclassName={'my-1'} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
