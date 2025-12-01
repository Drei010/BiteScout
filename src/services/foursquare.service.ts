import fsqDevelopersPlacesModule from "@api/fsq-developers-places";
const fsqDevelopersPlaces = (fsqDevelopersPlacesModule as any).default;
const apiKey = process.env.FOURSQUARE_API_KEY;
type PlaceSearchData = {
  action: string;
  parameters: {
    query: string;
    near: string;
    min_price?: number;
    open_now?: boolean;
  };
};

interface PlaceSearchParams {
  query: string;
  near: string;
  "X-Places-Api-Version": string;
  open_now?: boolean;
  min_price?: number;
}

const callPlaceSearch = async (data: PlaceSearchData) => {
  const { query, min_price, open_now, near } = data.parameters;
  const params: PlaceSearchParams = {
    query,
    near,
    "X-Places-Api-Version": "2025-06-17",
  };

  if (open_now !== null && open_now !== undefined) {
    params.open_now = open_now;
  }

  if (min_price !== null && min_price !== undefined) {
    params.min_price = min_price;
  }

  try {
    await fsqDevelopersPlaces.auth(apiKey);
    const { responseData } = await fsqDevelopersPlaces.placeSearch(params);
    return responseData;
  } catch (error) {
    throw new Error("Failed to call foursquare Places API");
  }
};

export default callPlaceSearch;
