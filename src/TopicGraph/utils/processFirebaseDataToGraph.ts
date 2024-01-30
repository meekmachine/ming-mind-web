import { FirestoreData, GraphData, GraphNode, GraphLink } from '../GraphTypes';

/**
 * Transforms Firestore data into a format suitable for graph visualization.
 * @param fetchedData Data fetched from Firestore.
 * @returns GraphData containing nodes and links.
 */
export const processFirebaseDataToGraph = (fetchedData: FirestoreData): GraphData => {
    let nodes: GraphNode[] = [];
    let links: GraphLink[] = [];

    // Example transformation logic
    Object.entries(fetchedData).forEach(([topicId, topicData]) => {
        // Assuming topicData contains a name and an array of related topics
        const node: GraphNode = {
            id: topicId,
            name: topicData.name,
            color: '',
            average_toxicity_score: 0,
            x: 0,
            y: 0,
            z: 0
        };
        nodes.push(node);

        // Assuming topicData.relatedTopics is an array of topic IDs
        topicData.relatedTopics.forEach((relatedTopicId) => {
            const link: GraphLink = {
                source: topicId,
                target: relatedTopicId,
                strength: 0,
                color: ''
            };
            links.push(link);
        });
    });

    return { nodes, links };
};
