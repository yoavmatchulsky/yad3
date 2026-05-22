export interface Listing {
  id: string;
  title: string;
  price: number;
  rooms: number;
  area: number;
  floor?: number;
  address: string;
  neighborhood?: string;
  city: string;
  imageUrl?: string;
  link: string;
  date?: string;
}

export interface FilterParams {
  city: string;
  minPrice?: number;
  maxPrice?: number;
  minRooms?: number;
  maxRooms?: number;
  minArea?: number;
  maxArea?: number;
  page?: number;
}
