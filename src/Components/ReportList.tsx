import { parse_time } from "@/Utils/helpers";

interface reportType {
  start: string;
  end: string;
  report: string;
}

export interface TrainListProps {
  breaking: reportType[];
  current: reportType[];
  future: reportType[];
  past: reportType[];
}

export interface IncomingType {
  train: string;
  all_reports: TrainListProps;
}

export default function ReportList({
  breaking,
  current,
  future,
  past,
}: TrainListProps) {
  const breaking_count = breaking.length;
  const current_count = current.length;
  const future_count = current.length;
  console.log(
    "Breaking Count",
    breaking_count,
    "current count",
    current_count,
    "future count",
    future_count
  );

  if (breaking_count > 0 || current_count > 0) {
    return (
      <>
        {current.map((val, index) => {
          var start_time = parse_time(val.start);
          const report = val.report;
          return (
            <div key={index}>
              <h1 className="text-white">
                <span className="text-blue-300 mr-2">{start_time}</span>
                {report}
              </h1>
            </div>
          );
        })}
        {breaking.map((val, index) => {
          var start_time = parse_time(val.start);
          const report = val.report;
          return (
            <div key={index}>
              <h1 className="text-white">
                <span className="text-red-300 mr-2">{start_time}</span>
                {report}
              </h1>
            </div>
          );
        })}
      </>
    );
  } else {
    return (
      <div>
        <h1 className="text-green-500">Service Good</h1>
      </div>
    );
  }
}
