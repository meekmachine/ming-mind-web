// src/TopicGraph/data/fetchData.ts
import { firestore } from '../firebase/FirebaseSetup';
import { getDocs, collection } from 'firebase/firestore';
import { FirestoreData } from '../GraphTypes';

/**
 * Fetches data from Firestore and returns it in a structured format.
 * @returns A promise that resolves to the structured Firestore data.
 */
export const fetchData = async (): Promise<FirestoreData> => {
    const querySnapshot = await getDocs(collection(firestore, "yourCollectionName"));
    let fetchedData: FirestoreData = {};

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedData[doc.id] = {
            // Assuming your data structure here. Adjust accordingly.
            name: data.name,
            relatedTopics: data.relatedTopics, // Example field
            // Add other fields as necessary
        };
    });

    return fetchedData;
};
