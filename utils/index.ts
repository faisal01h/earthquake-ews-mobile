export type QuakeData = {
    time: Date,
    magnitude: number,
    coordinate: Array<any>,
    text: string,
    depth: string,
    tsunami: boolean | null,
    Shakemap: string | null
  }

export const month = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export function twoDigits(num: number) {
  let num_s = num.toString();
  if(num_s.length === 1) return "0"+num_s;
  return num_s;
}