// firebase-driver.ts
import * as admin from "firebase-admin";

const serviceAccount = (await import("./account.json")).default as admin.ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore();
export const auth = admin.auth();

export const applyFilters = (collectionRef: admin.firestore.Query, filters: Record<string, any>) => {
  let ref = collectionRef;
  for (const key in filters) {
    ref = ref.where(key, "==", filters[key]);
  }
  return ref;
};

export const increment = (num: number) => admin.firestore.FieldValue.increment(num);
export const decrement = (num: number) => admin.firestore.FieldValue.increment(-1 * num);

export const CollectionRefCtor = (collectionName: string) => () => db.collection(collectionName);
export const DocumentRefCtor = (collectionName: string) => (id: string) => db.collection(collectionName).doc(id);
export const CounterDocumentRefCtor = (collectionName: string) => () => DocumentRefCtor("_counter")(collectionName);

export const initCounter = (collectionName: string) => {
  const counter = CounterDocumentRefCtor(collectionName);
  const counterRef = counter();
  counterRef.get().then((counterDoc) => {
    if (!counterDoc.exists) {
      counterRef.set({ count: 0 });
    }
  });
  return counter;
};
