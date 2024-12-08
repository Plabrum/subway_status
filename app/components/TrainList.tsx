'use client'
import { train_colors } from 'app/utils/helpers'
import { components } from '../types'
import ReportList from './ReportList'

type AlertsResponse = components['schemas']['AlertsResponse']

export function TrainList({ alerts }: { alerts: AlertsResponse[] }) {
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

      {alerts.map((alert, index) => {
        const trainStyle: string | undefined = train_colors(alert.train)
        return (
          <div
            key={index}
            className="my-4 grid grid-cols-5 py-3 max-md:rounded-lg max-md:border max-md:border-gray-500 sm:my-0"
          >
            <div className="col-span-1 flex items-center text-center">
              <h1 className={`mx-auto inline-block rounded-full border-2 px-4 py-2 text-xl sm:text-3xl ${trainStyle}`}>
                {alert.train}
              </h1>
            </div>
            <div className="col-span-4 my-auto flex-row items-center">
              <ReportList
                breaking={alert.breaking}
                current={alert.current}
                future={alert.future}
                past={alert.past}
                pclassName={'my-1'}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
