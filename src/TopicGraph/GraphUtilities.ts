import { firestore } from './firebase/FirebaseSetup';
import { collection, getDocs } from 'firebase/firestore';
import { scaleLinear } from 'd3-scale';
import { GraphData, GraphNode, GraphLink, FirestoreData } from './GraphTypes';

const processFirebaseDataToGraph = (data: FirestoreData): GraphData => {
    let nodes: GraphNode[] = [];
    let links: GraphLink[] = [];

    const toxicityColorScale = scaleLinear<string>()
        .domain([0, 1]) // Assuming toxicity ranges from 0 to 1
        .range(['green', 'red']); // Green (non-toxic) to red (toxic)

    // Example positioning logic (modify as needed)
    let positionIndex = 0;
    const positionStep = 50;

    Object.entries(data).forEach(([topicId, topicData]) => {
        if (topicId === '-1') return;

        const topicName = topicData.topic_name || `Topic ${topicId}`;
        const averageToxicity = topicData.average_toxicity || 0;

        // Assign positions (for example in a line or grid)
        const x = positionIndex * positionStep;
        const y = 0; // Adjust as needed
        const z = 0; // Adjust as needed
        positionIndex++;

        nodes.push({
            id: topicId,
            name: topicName,
            color: toxicityColorScale(averageToxicity),
            average_toxicity_score: averageToxicity,
            x: x,
            y: y,
            z: z,
        });

        // Process links between topics
        Object.entries(topicData).forEach(([key, value]) => {
            if (!isNaN(Number(key)) && key !== '-1' && key !== 'convosations') {
                const targetToxicity = data[key]?.average_toxicity || 0;
                const edgeColor = toxicityColorScale((averageToxicity + targetToxicity) / 2);

                links.push({
                    source: topicId,
                    target: key,
                    strength: typeof value === 'number' ? value : 0,
                    color: edgeColor,
                });
            }
        });
    });

    // Sort links by strength and keep only the top fraction (e.g., top 20%)
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

    const isNodeExpanded = newNodes.some((node) => node.id.startsWith(`${nodeId}-conv`));

    if (!isNodeExpanded) {
        // Fetch conversation data only for the node being expanded
        const expandedData = await fetchAndProcessConversationData(nodeId, rawData);

        newNodes = [...newNodes, ...expandedData.newNodes];
        newLinks = [...newLinks, ...expandedData.newLinks];
    } else {
        // Collapse logic - Remove conversation nodes and links for the specific node
        newNodes = newNodes.filter((node) => !node.id.startsWith(`${nodeId}-conv`));
        newLinks = newLinks.filter(
            (link) =>
                !(typeof link.source === 'object' ? link.source : link.source).startsWith(`${nodeId}-conv`) &&
                !(typeof link.target === 'object' ? link.target : link.target).startsWith(`${nodeId}-conv`)
        );
    }

    setGraphData({ nodes: newNodes, links: newLinks });
};


async function fetchAndProcessConversationData(
    nodeId: string,
    rawData: FirestoreData
): Promise<{ newNodes: GraphNode[]; newLinks: GraphLink[] }> {
    let newNodes: GraphNode[] = [];
    let newLinks: GraphLink[] = [];

    // Fetch all conversations for the node
    const conversationSnapshot = await getDocs(collection(firestore, `topics1/${nodeId}/convosations`));

    // Prepare batch requests for speakers in each conversation
    const speakerRequests = conversationSnapshot.docs.map((doc) => 
        getDocs(collection(firestore, `topics1/${nodeId}/convosations/${doc.id}/speakers`))
    );

    // Execute all speaker requests in parallel
    const speakerSnapshots = await Promise.all(speakerRequests);

    speakerSnapshots.forEach((speakersSnapshot, index) => {
        const convId = conversationSnapshot.docs[index].id;
        const emotions = speakersSnapshot.docs.map((doc) => doc.data().emoji);
        const emotionLabel = emotions.join(' vs ');

        newNodes.push({
            id: `${nodeId}-conv-${convId}`,
            name: emotionLabel,
            color: 'white',
            x: 0, // Placeholder - Update as per your layout logic
            y: 0, // Placeholder - Update as per your layout logic
            z: 0, // Placeholder - Update as per your layout logic
            average_toxicity_score: 0 // Placeholder or based on some calculation
        });

        newLinks.push({
            source: nodeId,
            target: `${nodeId}-conv-${convId}`,
            strength: 1, // Default strength, adjust as needed
            color: 'white'
        });
    });

    return { newNodes, newLinks };
}
export { toggleNodeExpansion, processFirebaseDataToGraph };
