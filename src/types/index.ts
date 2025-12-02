export interface ErrorResponse {
  error: string;
  message: string;
}

export type PlaceSearchData = {
  action: string;
  parameters: {
    query: string;
    near: string;
    min_price?: number;
    open_now?: boolean;
  };
};