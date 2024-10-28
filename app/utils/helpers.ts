export function parse_time(isotime: string): string {
  interface mmDict<T> {
    [Key: string]: T
  }
  const MM: mmDict<string> = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec'
  }

  const month = MM[isotime.slice(5, 7)]
  const day = Number(isotime.slice(8, 10))
  const time = isotime.slice(11, 16)
  return `${month}  ${day} ${time}`
}

export function train_colors(train_name: string): string {
  interface colorDict<T> {
    [Key: string]: T
  }
  const color_map: colorDict<string> = {
    A: 'bg-[#0139A6] text-white', //blue
    C: 'bg-[#0139A6] text-white', //blue
    E: 'bg-[#0139A6] text-white', //blue
    //
    B: 'bg-[#FF6218] text-white', //Orange
    D: 'bg-[#FF6218] text-white', //Orange
    F: 'bg-[#FF6218] text-white', //Orange
    M: 'bg-[#FF6218] text-white', //Orange
    //
    G: 'bg-[#6CBF42] text-white', //Light green
    //
    L: 'bg-[#A6A9AC] text-white', //slate gray
    //
    J: 'bg-[#996633] text-white', //brown
    Z: 'bg-[#996633] text-white', //brown
    //
    N: 'bg-[#FBCC09] text-black', // yellow with black text
    Q: 'bg-[#FBCC09] text-black', // yellow with black text
    R: 'bg-[#FBCC09] text-black', // yellow with black text
    W: 'bg-[#FBCC09] text-black', // yellow with black text
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
    GS: 'bg-[#808183] text-white', //I think this is the shuttle
    SI: 'bg-[#0139A6] text-white' //I think this is a staten island train?
  }
  return color_map[train_name]
}
