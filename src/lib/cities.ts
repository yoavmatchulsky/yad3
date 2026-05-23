export interface City {
  code: number;
  name: string;
  nameHe: string;
}

export const CITIES: City[] = [
  { name: "Tel Aviv", nameHe: "תל אביב", code: 5000 },
  { name: "Jerusalem", nameHe: "ירושלים", code: 3000 },
  { name: "Haifa", nameHe: "חיפה", code: 4000 },
  { name: "Rishon LeZion", nameHe: "ראשון לציון", code: 8700 },
  { name: "Petah Tikva", nameHe: "פתח תקווה", code: 7900 },
  { name: "Ashdod", nameHe: "אשדוד", code: 70 },
  { name: "Netanya", nameHe: "נתניה", code: 7400 },
  { name: "Beer Sheva", nameHe: "באר שבע", code: 9000 },
  { name: "Ramat Gan", nameHe: "רמת גן", code: 8600 },
  { name: "Bat Yam", nameHe: "בת ים", code: 6900 },
  { name: "Holon", nameHe: "חולון", code: 6500 },
  { name: "Herzliya", nameHe: "הרצליה", code: 6400 },
  { name: "Rehovot", nameHe: "רחובות", code: 8300 },
  { name: "Kfar Saba", nameHe: "כפר סבא", code: 7000 },
  { name: "Raanana", nameHe: "רעננה", code: 8400 },
  { name: "Lod", nameHe: "לוד", code: 7100 },
  { name: "Ramat Hasharon", nameHe: "רמת השרון", code: 8500 },
  { name: "Modi'in", nameHe: "מודיעין", code: 1020 },
  { name: "Givatayim", nameHe: "גבעתיים", code: 6200 },
  { name: "Bnei Brak", nameHe: "בני ברק", code: 6100 },
  { name: "Ashkelon", nameHe: "אשקלון", code: 600 },
  { name: "Nahariya", nameHe: "נהריה", code: 7300 },
  { name: "Nazareth", nameHe: "נצרת", code: 7500 },
  { name: "Eilat", nameHe: "אילת", code: 2400 },
];

export function findCityCode(input: string): number | null {
  const normalized = input.trim().toLowerCase();
  const city = CITIES.find(
    (c) =>
      c.name.toLowerCase() === normalized ||
      c.nameHe === input.trim() ||
      c.name.toLowerCase().startsWith(normalized) ||
      c.nameHe.startsWith(input.trim()),
  );
  return city?.code ?? null;
}

export function getAllCityNames(): string[] {
  return CITIES.flatMap((c) => [c.name, c.nameHe]);
}
