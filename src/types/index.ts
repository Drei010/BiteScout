import { z } from "zod";

export const errorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
});
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export const placeSearchDataSchema = z.object({
  action: z.string(),
  parameters: z.object({
    query: z.string(),
    near: z.string(),
    min_price: z.number().optional().nullable(),
    open_now: z.boolean().optional().nullable(),
  }),
});

export type PlaceSearchData = z.infer<typeof placeSearchDataSchema>;

export const placeSearchParamsSchema = z.object({
  query: z.string(),
  near: z.string(),
  fields: z.string(),
  "X-Places-Api-Version": z.string(),
  open_now: z.boolean().optional().nullable(),
  min_price: z.number().optional().nullable(),
});

export type PlaceSearchParams = z.infer<typeof placeSearchParamsSchema>;
