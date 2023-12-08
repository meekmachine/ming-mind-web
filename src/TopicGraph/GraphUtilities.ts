import { firestore } from './FirebaseSetup';
import { collection, getDocs } from 'firebase/firestore';
import { scaleLinear } from 'd3-scale';
import { GraphData, GraphNode, GraphLink, FirestoreData } from './GraphTypes';

export const processFirebaseDataToGraph = (data: FirestoreData): GraphData => {
    let nodes: GraphNode[] = [];
    let links: GraphLink[] = [];

    const toxicityColorScale = scaleLinear<string>()
                                .domain([0, 1]) // Assuming toxicity ranges from 0 to 1
                                .range(['green', 'red']); // Green (non-toxic) to red (toxic)

    Object.entries(data).forEach(([topicId, topicData]) => {
        if (topicId === '-1') return;

        const topicName = topicData.topic_name || `Topic ${topicId}`;
        const averageToxicity = topicData.average_toxicity || 0;
        nodes.push({ id: topicId, name: topicName, color: (toxicityColorScale(averageToxicity) as string)});

        Object.entries(topicData).forEach(([key, value]) => {
            if (!isNaN(Number(key)) && key !== '-1' && key !== 'convosations') {
                const targetToxicity = data[key]?.average_toxicity || 0;
                const edgeColor = toxicityColorScale((averageToxicity + targetToxicity) / 2);

                links.push({
                    source: topicId,
                    target: key,
                    strength: typeof value === 'number' ? value : 0,
                    color: edgeColor
                });
            }
        });
    });

    // Sorting links by strength and keeping only the top 20%
    links.sort((a, b) => b.strength - a.strength);
    links = links.slice(0, Math.ceil(links.length * 0.2));

    return { nodes, links };
};

const toggleNodeExpansion = async (
    nodeId: string, 
    graphData: GraphData,
    setGraphData: (data: GraphData) => void,
    rawData: FirestoreData
) => {
    let newNodes = [...graphData.nodes];
    let newLinks = [...graphData.links];

    const isNodeExpanded = newNodes.some(node => node.id.startsWith(`${nodeId}-conv`));

    if (!isNodeExpanded) {
        // Fetch conversation data only for the node being expanded
        const expandedData = await fetchAndProcessConversationData(nodeId, rawData);

        newNodes = [...newNodes, ...expandedData.newNodes];
        newLinks = [...newLinks, ...expandedData.newLinks];
    } else {
        // Collapse logic - Remove conversation nodes and links for the specific node
        newNodes = newNodes.filter(node => !node.id.startsWith(`${nodeId}-conv`));
        newLinks = newLinks.filter(link => 
            !(typeof link.source === 'object' ? link.source : link.source).startsWith(`${nodeId}-conv`) &&
            !(typeof link.target === 'object' ? link.target : link.target).startsWith(`${nodeId}-conv`)
        );
    }

    setGraphData({ nodes: newNodes, links: newLinks });
};

// ... (other imports and functions remain unchanged)

async function fetchAndProcessConversationData(nodeId: string, rawData: FirestoreData): Promise<{ newNodes: GraphNode[], newLinks: GraphLink[] }> {
    let newNodes: GraphNode[] = [];
    let newLinks: GraphLink[] = [];

    // Fetch all conversations for the node
    const conversationSnapshot = await getDocs(collection(firestore, `topics1/${nodeId}/convosations`));

    // Prepare batch requests for speakers in each conversation
    const speakerRequests = conversationSnapshot.docs.map(doc => 
        getDocs(collection(firestore, `topics1/${nodeId}/convosations/${doc.id}/speakers`))
    );

    // Execute all speaker requests in parallel
    const speakerSnapshots = await Promise.all(speakerRequests);

    speakerSnapshots.forEach((speakersSnapshot, index) => {
        const convId = conversationSnapshot.docs[index].id;
        const emotions = speakersSnapshot.docs.map(doc => doc.data().emoji);
        const emotionLabel = emotions.join(' vs ');

        newNodes.push({
            id: `${nodeId}-conv-${convId}`,
            name: emotionLabel,
            color: 'white'
        });

        // Assigning a default link strength, can be adjusted as needed
        newLinks.push({
            source: nodeId,
            target: `${nodeId}-conv-${convId}`,
            strength: 1,
            color: 'white'
        });
    });

    return { newNodes, newLinks };
}

export { toggleNodeExpansion, fetchAndProcessConversationData };

