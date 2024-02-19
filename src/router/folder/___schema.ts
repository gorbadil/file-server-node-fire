import zod from "zod";

export const FolderSchema = zod.object({
  name: zod.string(),
  parentId: zod.string().nullable().optional(),
});
