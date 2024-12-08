import { DateTime } from 'luxon'

export function getFullBackendURL(): string {
  return process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://subway.plabrum.com'
}

export function parseTime(isotime: string): string {
  const date = DateTime.fromISO(isotime).setZone('local')
  return date.toFormat('MMM d h:mma')
}

export function train_colors(train_name: string): string | undefined {
  interface colorDict<T> {
    [Key: string]: T
  }
  const color_map: colorDict<string> = {
    'A': 'bg-[#0139A6] text-white', //blue
    'C': 'bg-[#0139A6] text-white', //blue
    'E': 'bg-[#0139A6] text-white', //blue
    //
    'B': 'bg-[#FF6218] text-white', //Orange
    'D': 'bg-[#FF6218] text-white', //Orange
    'F': 'bg-[#FF6218] text-white', //Orange
    'M': 'bg-[#FF6218] text-white', //Orange
    //
    'G': 'bg-[#6CBF42] text-white', //Light green
    //
    'L': 'bg-[#A6A9AC] text-white', //slate gray
    //
    'J': 'bg-[#996633] text-white', //brown
    'Z': 'bg-[#996633] text-white', //brown
    //
    'N': 'bg-[#FBCC09] text-black', // yellow with black text
    'Q': 'bg-[#FBCC09] text-black', // yellow with black text
    'R': 'bg-[#FBCC09] text-black', // yellow with black text
    'W': 'bg-[#FBCC09] text-black', // yellow with black text
    //
    '1': 'bg-[#EE352E] text-white', //Red
    '3': 'bg-[#EE352E] text-white', //Red
    '2': 'bg-[#EE352E] text-white', //Red
    //
    '4': 'bg-[#00933C] text-white', //green
    '5': 'bg-[#00933C] text-white', //green
    '6': 'bg-[#00933C] text-white', //green
    //
    '7': 'bg-[#B933AD] text-white', // purple
    //
    'GS': 'bg-[#808183] text-white', //I think this is the shuttle
    'SI': 'bg-[#0139A6] text-white' //I think this is a staten island train?
  }
  return color_map[train_name]
}
