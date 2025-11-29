import fsqDevelopersPlaces from "@api/fsq-developers-places";

type PlaceSearchData = {
  action: string;
  parameters: {
    query: string;
    near: string;
    min_price?: number;
    open_now?: boolean;
  };
};

const callPlaceSearch = async (data: PlaceSearchData) => {
  const { query, min_price, open_now, near } = data.parameters;
  const params: any = {
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

  console.log("params", params);
  try {
    const apiKey = process.env.FOURSQUARE_API_KEY || "";
    await fsqDevelopersPlaces.auth(apiKey);
    const { data } = await fsqDevelopersPlaces.placeSearch(params);
    return data;
  } catch (error) {
    console.error("Error calling Foursquare Places API:", error);
    throw error;
  }
};

export default callPlaceSearch;
