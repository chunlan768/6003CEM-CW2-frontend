export interface Hotel {
  _id: string;
  name: string;
  location: string;
  price: number;
  stars?: number; // 可選屬性
  facilities?: string; // 可選屬性，逗號分隔的字符串
}