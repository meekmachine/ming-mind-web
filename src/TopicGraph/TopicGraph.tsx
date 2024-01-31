import React, { useEffect, useRef } from 'react';
import ForceGraph3D from '3d-force-graph';
import { useGraphData } from './hooks/useGraphData';
import { useThreeSetup } from './hooks/useThreeSetup';
import { toggleNodeExpansion } from './utils/toggleNodeExpansion';

const TopicGraph = ({ onFetchConversation, onNodeClick }) => {
    const graphRef = useRef<HTMLDivElement>(null);
    const { graphData, isLoading, setIsLoading } = useGraphData();
    const { setupThree, cleanupThree } = useThreeSetup(graphRef, isLoading);

    useEffect(() => {
        if (!graphRef.current || !graphData.nodes.length) return;

        const graph = ForceGraph3D()(graphRef.current)
            .graphData(graphData)
            .nodeThreeObject(node => setupThree.createNodeMaterial(node))
            .onNodeClick(node => {
                setIsLoading(true);
                toggleNodeExpansion(node.id, graphData)
                    .then(() => setIsLoading(false))
                    .catch((error) => {
                        console.error("Error expanding node:", error);
                        setIsLoading(false);
                    });
            });

        // This could be a place to use setupThree for additional Three.js setup if needed

        return () => {
            cleanupThree(); // Cleanup Three.js setup on component unmount
        };
    }, [graphData, isLoading, setIsLoading, setupThree, cleanupThree]);

    return <div ref={graphRef} style={{ width: '100%', height: '100%', position: 'absolute' }} />;
};

export default TopicGraph;
