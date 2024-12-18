'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin } from 'lucide-react'
import { useState } from 'react'
import { Stop, TrainReport } from '../types'
import { parseTime } from '../utils/helpers'
import ChevronButton from './ChevronButton'

interface AlertReportProps {
  report: TrainReport
}

const StopInfo = ({ stop }: { stop: Stop }) => (
  <div className="flex items-center space-x-2 rounded-md bg-gray-700 p-2">
    <MapPin className="h-4 w-4 text-gray-300" />
    <span className="text-gray-200">{stop.stop_name || stop.stop_id}</span>
  </div>
)

const InfoItem = ({ title, info }: { title: string; info: string }) => (
  <div>
    <h3 className="font-semibold text-gray-300">{title}</h3>
    <p>{info}</p>
  </div>
)

export default function AlertReport({ report }: AlertReportProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <Card className="w-full border-transparent bg-gray-800 text-white">
      <CardHeader
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-3 sm:min-h-28 sm:p-4"
      >
        <CardTitle className="flex grow flex-col justify-between gap-y-2">
          <div className="flex flex-row items-center justify-between">
            {report.alert_status === 'suspended' ? (
              <Badge
                variant={'destructive'}
                className="h-5 border-transparent bg-red-700 text-sm text-white sm:h-10"
              >
                {report.alert_type}
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="h-5 border-transparent bg-white text-sm text-slate-800 hover:bg-slate-200 sm:h-10"
              >
                {report.alert_type}
              </Badge>
            )}
            <div className="text-xs font-bold sm:h-6">{parseTime(report.alert_start)}</div>
          </div>
          <div className="flex w-full flex-row items-center justify-between">
            <h1 className="text-md sm:text-xl">{report.header_text}</h1>
            <ChevronButton
              onClick={() => setIsExpanded(!isExpanded)}
              isDown={isExpanded}
              className="h-5 w-5 sm:h-8 sm:w-8"
            />
          </div>
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <InfoItem
              title={'Alert Start'}
              info={parseTime(report.alert_start)}
            />
            {report.alert_end && (
              <InfoItem
                title={'Alert End'}
                info={parseTime(report.alert_end)}
              />
            )}
            <InfoItem
              title={'Created'}
              info={parseTime(report.alert_created)}
            />
            <InfoItem
              title={'Updated'}
              info={parseTime(report.alert_updated)}
            />
          </div>

          {report.affected_stops.length > 0 && (
            <div>
              <h3 className="mb-2 font-semibold text-gray-300">Affected Stops</h3>
              <div className="space-y-2">
                {report.affected_stops.map((stop, index) => (
                  <StopInfo
                    key={index}
                    stop={stop}
                  />
                ))}
              </div>
            </div>
          )}

          {report.description_text && (
            <div className="rounded bg-gray-700 p-2">
              <h3 className="font-semibold">Description</h3>
              <p className="text-sm">{report.description_text}</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
