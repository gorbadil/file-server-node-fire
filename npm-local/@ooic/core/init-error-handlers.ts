import fs from "fs"
import { toKebabCase } from "@ooic/utils"
import { Express } from "express"
import path from "path"

export const initErrorHandlers = async (app: Express) => {
  const ErrorHandlers = {}
  const p = path.resolve(__dirname, "../../../src/errors/handlers")

  const files = fs.readdirSync(p, {
    withFileTypes: true,
  })
  await Promise.all(
    files.map((fileName) => {
      if (!fileName.isFile()) return
      const fileNamePure = fileName.name.replace(/\.[^.]*$/, "")
      return import(`~/errors/handlers/${fileNamePure}`)
    })
  ).then((responses) => {
    responses.forEach((loadedModule, index) => {
      const name = toKebabCase(files[index].name.replace(/\.[^.]*$/, ""))
      ErrorHandlers[name] = loadedModule.default
      app.use(ErrorHandlers[name])
    })
  })
}
