export interface Hotel {
  _id: string;
  name: string;
  location: string;
  price: number;
  stars?: number;
  facilities?: string;
}