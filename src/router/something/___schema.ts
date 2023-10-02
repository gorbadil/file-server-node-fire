import zod from "zod"

export const SomethingSchema = zod.object({
    title:zod.string()
})
  