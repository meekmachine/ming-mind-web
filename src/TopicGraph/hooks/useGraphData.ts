// src/TopicGraph/hooks/useGraphData.ts
import { useState, useEffect } from 'react';
import { firestore } from '../firebase/FirebaseSetup';
import { getDocs, collection } from 'firebase/firestore';
import { processFirebaseDataToGraph } from '../utils/processFirebaseDataToGraph';
import { GraphData, FirestoreData } from '../GraphTypes';

export const useGraphData = () => {
    const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(firestore, "topics1"));
            let fetchedData: FirestoreData = {};

            querySnapshot.forEach((doc) => {
                const topicId = doc.id;
                const topicData = doc.data();
                fetchedData[topicId] = topicData;
            });

            // Directly use processFirebaseDataToGraph here instead of processData
            setGraphData(processFirebaseDataToGraph(fetchedData));
        };

        fetchData();
    }, []);

    return graphData;
};
