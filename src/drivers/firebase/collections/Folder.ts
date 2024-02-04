import { CollectionRefCtor, DocumentRefCtor, initCounter } from "..";

export const collectionName = "folder";

export type FolderAttributes = {
  id: string;
  name: string;
  parentId: string;
};

export const FolderCollection = CollectionRefCtor(collectionName);
export const FolderDocument = DocumentRefCtor(collectionName);
export const FolderCounter = initCounter(collectionName);
