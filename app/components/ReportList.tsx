import { parse_time } from 'app/utils/helpers'
import { components } from '../types'
type ReportType = components['schemas']['ReportType']

export default function ReportList({ reports, pclassName }: { reports: ReportType; pclassName: string }) {
  const { breaking, current } = reports
  const breaking_count = breaking.length
  const current_count = current.length
  if (breaking_count > 0 || current_count > 0) {
    return (
      <>
        {current.map((val, index) => {
          if (val.start == null) {
            throw Error('start is null')
          }
          const start_time = parse_time(val.start)
          const report = val.report
          return (
            <h1
              key={index}
              className={`text-white ${pclassName}`}
            >
              <span className="mr-2 text-blue-300">Notice {start_time}</span>
              {report}
            </h1>
          )
        })}
        {breaking.map((val, index) => {
          if (val.start == null) {
            throw Error('start is null')
          }
          const start_time = parse_time(val.start)
          const report = val.report
          return (
            <h1
              key={index}
              className={`text-white ${pclassName}`}
            >
              <span className="mr-2 text-red-300">Alert {start_time}</span>
              {report}
            </h1>
          )
        })}
      </>
    )
  } else {
    return <h1 className={`text-green-500 ${pclassName}`}>Service Good</h1>
  }
}
