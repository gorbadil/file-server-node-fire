import zod from "zod"

export const SomethingSchema = zod.object({
    name:zod.string()
})
  