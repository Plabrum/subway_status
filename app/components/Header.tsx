import { cn } from '@/lib/utils'
import Link from 'next/link'

type Props = { className?: string }

function Header({ className }: Props) {
  return (
    <Link href={'/'}>
      <h1 className={cn('w-full py-4 text-center text-3xl font-bold sm:p-8 sm:text-4xl', className)}>
        MTA Subway Information
      </h1>
    </Link>
  )
}

export default Header
