import zod from "zod"

export const FileSchema = zod.object({
    name: zod.string(),
  parentId: zod.string(),
  url: zod.string(),
})
  