import { GraphData } from "react-force-graph-3d";
import { FirestoreData } from "../GraphTypes";
import { fetchAndProcessConversationData } from "../data/fetchAndProcessConverstionData";

const toggleNodeExpansion = async (
    nodeId: string,
    graphData: GraphData,
    setGraphData: (data: GraphData) => void,
    rawData: FirestoreData
) => {
    let newNodes = [...graphData.nodes];
    let newLinks = [...graphData.links];

    const isNodeExpanded = newNodes.some((node) => (node.id as string).startsWith(`${nodeId}-conv`));

    if (!isNodeExpanded) {
        // Fetch conversation data only for the node being expanded
        const expandedData = await fetchAndProcessConversationData(nodeId, rawData);

        newNodes = [...newNodes, ...expandedData.newNodes];
        newLinks = [...newLinks, ...expandedData.newLinks];
    } else  {
        // Collapse logic - Remove conversation nodes and links for the specific node

        newNodes = newNodes.filter((node) => !(node.id as String).startsWith(`${nodeId}-conv`));
        newLinks = newLinks.filter(
            (link) =>
                !(typeof link.source === 'object' ? link.source : link.source as String).startsWith(`${nodeId}-conv`) &&
                !(typeof link.target === 'object' ? link.target : link.target as String).startsWith(`${nodeId}-conv`)
        );
    }

    setGraphData({ nodes: newNodes, links: newLinks });
};
