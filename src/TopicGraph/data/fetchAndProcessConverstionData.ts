import { collection, getDocs } from "@firebase/firestore";
import { FirestoreData, GraphLink, GraphNode } from "../GraphTypes";
import { firestore } from "../firebase/FirebaseSetup";

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
export { fetchAndProcessConversationData };
