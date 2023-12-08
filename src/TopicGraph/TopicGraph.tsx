import React, { useState, useEffect, useRef } from 'react';
import ForceGraph3D from '3d-force-graph';
import { Sprite } from 'three';
import { firestore } from './FirebaseSetup';
import { toggleNodeExpansion, processFirebaseDataToGraph } from './GraphUtilities';
import { createTextMaterial } from './ThreeCustomElements';
import { getDocs, collection, QueryDocumentSnapshot } from 'firebase/firestore';
import { GraphData, TopicData, FirestoreData, GraphNode } from './GraphTypes';

const TopicGraph: React.FC = () => {
    const graphRef = useRef<HTMLDivElement>(null);
    const [expandedNode, setExpandedNode] = useState<string | null>(null);
    const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
    const [rawData, setRawData] = useState<FirestoreData>({});

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(firestore, "topics1"));
            let fetchedData: FirestoreData = {};
    
            querySnapshot.forEach((doc: QueryDocumentSnapshot<TopicData>) => {
                const topicId = doc.id;
                const topicData = doc.data();
                fetchedData[topicId] = topicData;
            });
    
            const processedGraphData = processFirebaseDataToGraph(fetchedData);
            setGraphData(processedGraphData);
        };
    
        fetchData();
    }, []);

    useEffect(() => {
        if (!graphRef.current || !graphData) return;

        const newGraph = ForceGraph3D()(graphRef.current)
            .graphData(graphData)
            .nodeThreeObject(node => {
                const sprite = new Sprite(createTextMaterial((node as GraphNode).name, (node as GraphNode).id.includes('conv')));
                sprite.scale.set(40, 20, 1);
                return sprite;
            })
     
            .linkColor(() => 'white')
            .onNodeClick(async (node: any) => {
                await toggleNodeExpansion(
                    (node as GraphNode).id, 
                    graphData, 
                    setGraphData,
                    rawData
                );

                setExpandedNode(expandedNode === (node as GraphNode).id ? null : (node as GraphNode).id);
            });

        // Additional graph setup

    }, [graphData, expandedNode]);

    return <div ref={graphRef} style={{ width: '100%', height: '100%', position: 'absolute' }} />;
};

export default TopicGraph;
