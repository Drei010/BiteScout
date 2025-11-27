import fsqDevelopersPlaces from "@api/fsq-developers-places";

fsqDevelopersPlaces
  .placeSearch({ "X-Places-Api-Version": "2025-06-17" })
  .then(({ data }) => console.log(data))
  .catch((err) => console.error(err));
