// src/TopicGraph/data/fetchData.ts
import { firestore } from '../firebase/FirebaseSetup';
import { getDocs, collection } from 'firebase/firestore';
import { FirestoreData } from '../GraphTypes';

export const fetchData = async (): Promise<FirestoreData> => {
    const querySnapshot = await getDocs(collection(firestore, "topics1"));
    let fetchedData: FirestoreData = {};

    querySnapshot.forEach((doc) => {
        const topicId = doc.id;
        const topicData = doc.data();
        fetchedData[topicId] = topicData;
    });

    return fetchedData;
};
