import React, { useState, useEffect, useRef } from 'react';
import ForceGraph3D from '3d-force-graph';
import { Sprite } from 'three';
import { firestore } from './FirebaseSetup';
import { processFirebaseDataToGraph, toggleNodeExpansion } from './GraphUtilities';
import { createTextMaterial } from './ThreeCustomElements';
import { getDocs, collection, QueryDocumentSnapshot } from 'firebase/firestore';
import { GraphData, TopicData, FirestoreData, GraphNode, GraphLink } from './GraphTypes';

const TopicGraph: React.FC = () => {
    const graphRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedNode, setExpandedNode] = useState<string | null>(null);
    const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
    const [rawData, setRawData] = useState<FirestoreData>({});

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const querySnapshot = await getDocs(collection(firestore, "topics"));
            let fetchedData: FirestoreData = {};
    
            querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
                const topicId = doc.id;
                const topicData = doc.data() as TopicData;
                fetchedData[topicId] = topicData;
                // No need to process links here, as they are handled within processFirebaseDataToGraph
            });
    
            // processFirebaseDataToGraph now returns both nodes and links
            const newGraphData = processFirebaseDataToGraph(fetchedData);
            setGraphData(newGraphData);
            setIsLoading(false);
        };
    
        fetchData();
    }, []);

    useEffect(() => {
        if (!graphRef.current || !graphData) return;

        const newGraph = ForceGraph3D()(graphRef.current)
            .graphData(graphData)
            .nodeThreeObject((node: any) => {
                const sprite = new Sprite(createTextMaterial(node.name));
                sprite.scale.set(40, 20, 1);
                return sprite;
            })
            .linkColor(() => 'white')
            .onNodeClick(async (node: any) => {
                if (isLoading) return;
                setIsLoading(true);

                if (expandedNode && expandedNode !== node.id) {
                    await toggleNodeExpansion(
                        expandedNode, 
                        graphData, 
                        setGraphData,
                        rawData
                    );
                }

                await toggleNodeExpansion(
                    node.id, 
                    graphData, 
                    setGraphData,
                    rawData
                );

                setExpandedNode(expandedNode === node.id ? null : node.id);
                setIsLoading(false);
            });

        // Intentionally not setting state to avoid re-render
        // setGraph(newGraph);

    }, [graphData, expandedNode]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <div ref={graphRef} style={{ width: '100%', height: '600px' }} />;
};

export default TopicGraph;
