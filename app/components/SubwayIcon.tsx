import { cn } from '@/lib/utils'
import Link from 'next/link'
import { TrainStatus } from '../types'
import { train_colors } from '../utils/helpers'
import ExclamationTriangle from './ExclamationTriangle'

interface SubwayIconProps {
  train: TrainStatus['train']
  status?: TrainStatus['status']
  className?: string
}

export default function SubwayIcon({ train, status, className }: SubwayIconProps) {
  return (
    <Link
      href={`/subway/${train}`}
      className={cn(
        'text-bold relative mx-auto flex aspect-square h-16 items-center justify-center rounded-full text-3xl font-bold',
        train_colors(train),
        className
      )}
    >
      {train}
      <span className="absolute -right-1 -top-1">
        <AlertBadge status={status ?? 'normal'} />
      </span>
    </Link>
  )
}

function AlertBadge({ status }: { status: TrainStatus['status'] }) {
  switch (status) {
    case 'normal':
      return <></>
    case 'warning':
      return (
        <ExclamationTriangle
          className="h-6 w-6"
          backgroundColor="grey"
        />
      )
    case 'suspended':
      return (
        <ExclamationTriangle
          className="h-6 w-6"
          backgroundColor="#EF4444"
        />
      )
  }
}
