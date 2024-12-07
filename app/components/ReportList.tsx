import { parseTime } from 'app/utils/helpers'
import { components } from '../types'
type ReportType = components['schemas']['Report']

export default function ReportList({
  breaking,
  current,
  pclassName
}: {
  breaking: ReportType[]
  past: ReportType[]
  current: ReportType[]
  future: ReportType[]
  pclassName: string
}) {
  const breaking_count = breaking.length
  const current_count = current.length
  if (breaking_count > 0 || current_count > 0) {
    return (
      <>
        {current.map((val, index) => {
          return (
            <h1
              key={index}
              className={`text-white ${pclassName}`}
            >
              <span className="mr-2 text-blue-300">Notice {parseTime(val.alert_start)}</span>
              {val.header_text}
            </h1>
          )
        })}
        {breaking.map((val, index) => {
          return (
            <h1
              key={index}
              className={`text-white ${pclassName}`}
            >
              <span className="mr-2 text-red-300">Alert {parseTime(val.alert_start)}</span>
              {val.header_text}
            </h1>
          )
        })}
      </>
    )
  } else {
    return <h1 className={`text-green-500 ${pclassName}`}>Service Good</h1>
  }
}
