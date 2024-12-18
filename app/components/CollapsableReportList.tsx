'use client'
import { useState } from 'react'
import { TrainReport } from '../types'
import AlertReport from './AlertReport'
import ChevronButton from './ChevronButton'

type Props = {
  title: string
  reportArray: TrainReport[]
}

function CollapsableReportList({ title, reportArray }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row items-center gap-x-2">
        <h3 className="text-xl font-bold">
          {title} ({reportArray.length})
        </h3>
        <ChevronButton
          onClick={() => setIsOpen(!isOpen)}
          isDown={isOpen}
        />
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
