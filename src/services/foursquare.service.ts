import validation from "../utils/validation.js";
import type { PlaceSearchData } from "../types/index.js";
import fsqDevelopersPlacesModule from "@api/fsq-developers-places";
const fsqDevelopersPlaces = (fsqDevelopersPlacesModule as any).default;
const apiKey = process.env.FOURSQUARE_API_KEY;
const { validateLLMOutput } = validation;

interface PlaceSearchParams {
  query: string;
  near: string;
  fields: string;
  "X-Places-Api-Version": string;
  open_now?: boolean;
  min_price?: number;
}

const callPlaceSearch = async (data: PlaceSearchData) => {
  const validationError = validateLLMOutput(data);
  if (validationError) {
    throw new Error(validationError.message);
  }

  const { query, min_price, open_now, near } = data.parameters;
  const params: PlaceSearchParams = {
    query,
    near,
    fields: "name,location,categories",
    "X-Places-Api-Version": "2025-06-17",
    ...(open_now !== undefined && { open_now }),
    ...(min_price !== undefined && { min_price }),
  };

  try {
    await fsqDevelopersPlaces.auth(apiKey);
    const responseData = await fsqDevelopersPlaces.placeSearch(params);

    return await callPlaceSearchSpecific(responseData);

    //raw response data
    // return responseData;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to call foursquare Places API: ${errorMessage}`);
  }
};

const callPlaceSearchSpecific = async (responseData: any) => {
  const results = responseData.data.results.map((place: any) => ({
    name: place.name,
    categories: place.categories?.map((cat: any) => cat.name).join(", "),
    address: place.location?.formatted_address,
  }));

  results.forEach((place: any) => {
    console.log("Name:", place.name);
    console.log("Categories:", place.categories);
    console.log("Address:", place.address);
    console.log("--------");
  });
  return results;
};
export default callPlaceSearch;
