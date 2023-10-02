import zod, { ZodObject } from "zod";

export const WithId = (original: ZodObject<any>) =>
  original.extend({
    id: zod.number(),
  });

export const AsList = (original: ZodObject<any>) =>
  zod.object({
    result: zod.array(WithId(original)),
    count: zod.number(),
    page: zod.number(),
    pageSize: zod.number(),
    pageCount: zod.number(),
  });

export const StdQuery = zod
  .object({
    _sortBy: zod.string(),
    _sortType: zod.string(),
    _page: zod.number(),
    _pageSize: zod.number(),
  })
  .partial();
