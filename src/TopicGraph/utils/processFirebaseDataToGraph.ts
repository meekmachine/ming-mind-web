import { scaleLinear } from 'd3-scale';
import { FirestoreData, GraphData, GraphNode, GraphLink } from '../GraphTypes';

/**
 * Transforms Firestore data into a format suitable for graph visualization.
 * @param fetchedData Data fetched from Firestore.
 * @returns GraphData containing nodes and links.
 */
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
export { processFirebaseDataToGraph };