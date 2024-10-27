import { parse_time } from '@/Utils/helpers'

export default function ReportList({
  reports,
  isLoading,
  pclassName
}: {
  reports: TrainListProps
  isLoading: boolean
  pclassName: string
}) {
  const { breaking, current, future, past } = reports
  const breaking_count = breaking.length
  const current_count = current.length
  const future_count = future.length
  // Unused in this version:
  console.log('past', past, future_count)
  if (isLoading) {
    return (
      <div>
        <h1 className={`text-yellow-200 ${pclassName}`}>Loading ...</h1>
      </div>
    )
  } else if (breaking_count > 0 || current_count > 0) {
    return (
      <>
        {current.map((val, index) => {
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

interface reportType {
  start: string
  end: string
  report: string
}

export interface TrainListProps {
  breaking: reportType[]
  current: reportType[]
  future: reportType[]
  past: reportType[]
}

export interface IncomingType {
  train: string
  all_reports: TrainListProps
}

export function emptyTrainReport(): IncomingType[] {
  const empty_train_report: TrainListProps = {
    breaking: [],
    current: [],
    future: [],
    past: []
  }
  return [
    { train: 'A', all_reports: empty_train_report },
    { train: 'C', all_reports: empty_train_report },
    { train: 'E', all_reports: empty_train_report },
    //
    { train: 'B', all_reports: empty_train_report },
    { train: 'D', all_reports: empty_train_report },
    { train: 'F', all_reports: empty_train_report },
    { train: 'M', all_reports: empty_train_report },
    //
    { train: 'G', all_reports: empty_train_report },
    //
    { train: 'L', all_reports: empty_train_report },
    //
    { train: 'J', all_reports: empty_train_report },
    { train: 'Z', all_reports: empty_train_report },
    //
    { train: 'N', all_reports: empty_train_report },
    { train: 'Q', all_reports: empty_train_report },
    { train: 'R', all_reports: empty_train_report },
    { train: 'W', all_reports: empty_train_report },
    //
    { train: '1', all_reports: empty_train_report },
    { train: '3', all_reports: empty_train_report },
    { train: '2', all_reports: empty_train_report },
    //
    { train: '4', all_reports: empty_train_report },
    { train: '5', all_reports: empty_train_report },
    { train: '6', all_reports: empty_train_report },
    //
    { train: '7', all_reports: empty_train_report },
    //
    { train: 'GS', all_reports: empty_train_report },
    { train: 'SI', all_reports: empty_train_report }
  ]
}
