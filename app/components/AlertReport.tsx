'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Stop, TrainReport } from '../types'
import { parseTime } from '../utils/helpers'

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
    <Card className="w-full bg-gray-800 text-gray-100">
      <CardHeader onClick={() => setIsExpanded(!isExpanded)}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-md sm:text-xl">{report.header_text}</h1>
            <Badge
              variant="destructive"
              className="mr-auto h-5 bg-red-700 text-white sm:h-6"
            >
              {report.alert_type}
            </Badge>
          </div>
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden text-gray-400 hover:bg-slate-400 sm:block"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
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

          {report.description_text && (
            <div className="rounded bg-gray-700 p-2">
              <h3 className="font-semibold">Description</h3>
              <p>{report.description_text}</p>
            </div>
          )}

          {report.affected_stops.length > 0 && (
            <div>
              <h3 className="mb-2 font-semibold text-gray-300">Affected Stops</h3>
              <ScrollArea className="w-full rounded-md border border-gray-200 p-4 dark:border-gray-700">
                <div className="space-y-2">
                  {report.affected_stops.map((stop, index) => (
                    <StopInfo
                      key={index}
                      stop={stop}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
