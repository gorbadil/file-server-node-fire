import { InferSchemaType, Model, Schema } from "mongoose";
import { mongoose } from "~/drivers/mongoose";

/**
 * Represents the Mongoose schema of 'Something' documents.
 * 
 * This schema specifies the structure of documents that will be stored in the 'Something' collection.
 */
export const SomethingSchema = new Schema(
  {
    /* schema definitions */
  },
  { timestamps: true }
);

/**
 * The TypeScript type representing a document of the 'Something' model.
 * 
 * This type defines the shape of a single document in the 'Something' collection.
 */
export type SomethingType = InferSchemaType<typeof SomethingSchema>;

/**
 * The Mongoose model for 'Something' documents.
 * 
 * This model represents the interaction point for performing CRUD (Create, Read, Update, Delete) operations
 * on documents in the 'Something' collection.
 */
export const Something: Model<SomethingType> = mongoose.model("Something", SomethingSchema);