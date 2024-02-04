import { CollectionRefCtor, DocumentRefCtor, initCounter } from "..";

export const collectionName = "file";

export type FileAttributes = {
  id: string;
  name: string;
  parentId: string;
  url: string;
};

export const FileCollection = CollectionRefCtor(collectionName);
export const FileDocument = DocumentRefCtor(collectionName);
export const FileCounter = initCounter(collectionName);
