import { firestore } from './FirebaseSetup';
import { collection, getDocs } from 'firebase/firestore';
import { GraphData, GraphNode, GraphLink, FirestoreData } from './GraphTypes';

// Processes the raw Firestore data to graph data
export const processFirebaseDataToGraph = (data: FirestoreData): GraphData => {
    let nodes: GraphNode[] = [];
    let links: GraphLink[] = [];

    Object.entries(data).forEach(([topicId, topicData]) => {
        if (topicId === '-1') return;

        const topicName = topicData.topic_name || `Topic ${topicId}`;
        nodes.push({ id: topicId, name: topicName });

        Object.entries(topicData).forEach(([key, value]) => {
            if (!isNaN(Number(key)) && key !== '-1' && key !== 'convosations') {
                links.push({
                    source: topicId,
                    target: key,
                    strength: typeof value === 'number' ? value : 0
                });
            }
        });
    });

    return { nodes, links };
};

// Toggles the expansion of a node to show or hide its convosations
export const toggleNodeExpansion = async (
    nodeId: string, 
    graphData: GraphData,
    setGraphData: (data: GraphData) => void,
    rawData: FirestoreData
): Promise<void> => {
    let newNodes = [...graphData.nodes];
    let newLinks = [...graphData.links];

    const isNodeExpanded = newNodes.some(node => node.id.startsWith(`${nodeId}-conv`));

    if (isNodeExpanded) {
        newNodes = newNodes.filter(node => !node.id.startsWith(`${nodeId}-conv`));
        newLinks = newLinks.filter(link => !link.source.startsWith(`${nodeId}-conv`) && !link.target.startsWith(`${nodeId}-conv`));
    } else {
        const convosationSnapshot = await getDocs(collection(firestore, `topics/${nodeId}/convosations`));
        convosationSnapshot.forEach(doc => {
            const convId = doc.id;
            const convData = doc.data();
            const convNodeId = `${nodeId}-conv-${convId}`;

            newNodes.push({
                id: convNodeId,
                name: `Conv: ${convId}`
            });

            newLinks.push({
                source: nodeId,
                target: convNodeId,
                strength: convData.similarityScore || 0
            });
        });
    }

    setGraphData({ nodes: newNodes, links: newLinks });
};
