'use client'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { TrainReport } from '../types'
import AlertReport from './AlertReport'

type Props = {
  title: string
  reportArray: TrainReport[]
}

function CollapsableReportList({ title, reportArray }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="mt-8 flex flex-col gap-y-4">
      <div className="flex flex-row items-center gap-x-2">
        <h3 className="text-xl font-bold">
          {title} ({reportArray.length})
        </h3>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:bg-slate-400"
        >
          {isOpen ? <ChevronUp className="h-2 w-2" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      {isOpen &&
        reportArray.map((report, index) => (
          <AlertReport
            key={index}
            report={report}
          />
        ))}
    </div>
  )
}

export default CollapsableReportList
