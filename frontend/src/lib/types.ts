export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

export type RestaurantResult = {
  name: string;
  categories: string;
  address: string;
};

export type SearchResponse = RestaurantResult[] | { message: string } | { error: string };
