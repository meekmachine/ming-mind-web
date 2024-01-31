import React, { useEffect, useRef, useState } from 'react';
import ForceGraph3D from '3d-force-graph';
import * as THREE from 'three';
import { useGraphData } from './hooks/useGraphData';
import { firestore } from './firebase/FirebaseSetup';
import { getDocs, collection } from 'firebase/firestore';
import { GraphData, TopicData, FirestoreData, GraphNode } from './GraphTypes';
import { createNodeMaterial } from './utils/createNodeMaterial';
import { spinGraph } from './utils/spinGraph';
import { focusCameraOnNode } from './utils/focusCameraOnNode';
import { toggleNodeExpansion } from './GraphUtilities';

interface TopicGraphProps {
    onFetchConversation: (conversation: { formattedText: string; plainText: string; json: any }) => void;
    onNodeClick: (nodeId: string) => void;
}

const TopicGraph: React.FC<TopicGraphProps> = ({ onFetchConversation, onNodeClick }) => {
    const graphRef = useRef<HTMLDivElement>(null);
    const graphData = useGraphData(); // Hook to fetch and process graph data
    const [isLoading, setIsLoading] = useState(false); // State to manage loading indicator for node expansion

    useEffect(() => {
        if (!graphRef.current || graphData.nodes.length === 0) return;

        const graph = ForceGraph3D()(graphRef.current)
            .graphData(graphData)
            .nodeThreeObject(node => {
                const sprite = new THREE.Sprite(createNodeMaterial(node as GraphNode));
                sprite.scale.set(40, 20, 1);
                return sprite;
            })
            .onNodeClick((node: any) => {
                setIsLoading(true); // Trigger loading state when node expansion starts
                const graphNode = node as GraphNode;
                toggleNodeExpansion(graphNode.id, graphData, setIsLoading); // Adjusted to manage loading state
            });

        const spinInterval = spinGraph(graph, graphRef); // Adjusted to use graphRef directly

        return () => {
            clearInterval(spinInterval);
        };
    }, [graphData]);

    // Additional effects or logic can be added here

    return <div ref={graphRef} style={{ width: '100%', height: '100%', position: 'absolute' }} />;
};

export default TopicGraph;
