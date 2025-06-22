export interface Message {
  _id: string;
  hotelId: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
}