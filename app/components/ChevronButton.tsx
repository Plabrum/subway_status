import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { ReactElement } from 'react'

interface ChevronButtonProps {
  onClick: () => void
  isDown: boolean
  className?: string
}
export default function ChevronButton({ onClick, isDown, className }: ChevronButtonProps): ReactElement {
  return (
    <Button
      onClick={onClick}
      variant={'ghost'}
      className={cn('aspect-square rounded-md p-0 text-white hover:bg-transparent hover:text-white sm:p-2', className)}
    >
      {isDown ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
    </Button>
  )
}
