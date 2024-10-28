'use client'
import { train_colors } from 'app/utils/helpers'
import { useEffect, useState } from 'react'
import ReportList, { emptyTrainReport, IncomingType, TrainListProps } from './ReportList'

export function TrainList() {
  const [isLoading, setLoading] = useState(true)
  const [isError, setError] = useState(false)
  const [data, setData] = useState<IncomingType[]>(emptyTrainReport())

  useEffect(() => {
    fetch('/api/alerts', { next: { revalidate: 10 } })
      .then(async res => {
        try {
          const json = await res.json()
          setData(json)
        } catch (err) {
          setError(true)
          console.error('On Json Fetch', err)
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-3 sm:mx-auto sm:w-2/3">
      <div className="grid grid-cols-5 gap-x-6 gap-y-2 sm:gap-x-20 sm:gap-y-2">
        <div className="col-span-1 mb-4">
          <h1 className="text-center text-2xl sm:text-3xl">Trains</h1>
        </div>
        <div className="col-span-4 mb-4">
          <h1 className="text-center text-2xl sm:text-3xl">Current Reports</h1>
        </div>
      </div>

      {data.map((element, index) => {
        const train: string = element.train
        const reports: TrainListProps = element.all_reports
        const trainStyle: string = train_colors(train)
        return (
          <div
            key={index}
            className="my-4 grid grid-cols-5 py-3 max-md:rounded-lg max-md:border max-md:border-gray-500 sm:my-0"
          >
            <div className="col-span-1 flex items-center text-center">
              <h1 className={`mx-auto inline-block rounded-full border-2 px-4 py-2 text-xl sm:text-3xl ${trainStyle}`}>
                {train}
              </h1>
            </div>
            <div className="col-span-4 my-auto flex-row items-center">
              {isError ? (
                <h1 className="text-red-500">Error</h1>
              ) : (
                <ReportList
                  reports={reports}
                  isLoading={isLoading}
                  pclassName={'my-1'}
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
