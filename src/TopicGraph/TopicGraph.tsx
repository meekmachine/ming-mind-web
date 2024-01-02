import React, { useState, useEffect, useRef } from 'react';
import ForceGraph3D from "3d-force-graph";
import * as THREE from 'three';
import { firestore } from './FirebaseSetup';
import { toggleNodeExpansion, processFirebaseDataToGraph } from './GraphUtilities';
import { createNodeMaterial } from './ThreeCustomElements';
import { getDocs, collection, QueryDocumentSnapshot } from 'firebase/firestore';
import { GraphData, TopicData, FirestoreData, GraphNode } from './GraphTypes';

interface TopicGraphProps {
    onFetchConversation: (conversation: { formattedText: string; plainText: string; json: any }) => void;
    onNodeClick: (nodeId: string) => void;
}

const TopicGraph: React.FC<TopicGraphProps> = ({ onFetchConversation, onNodeClick }) => {
    const graphRef = useRef<HTMLDivElement>(null);
    const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
    const [rawData, setRawData] = useState<FirestoreData>({}); // Added rawData state
    const isNodeInteracted = useRef(false);

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(firestore, "topics1"));
            let fetchedData: FirestoreData = {};

            querySnapshot.forEach((doc: QueryDocumentSnapshot<TopicData>) => {
                const topicId = doc.id;
                const topicData = doc.data();
                fetchedData[topicId] = topicData;
            });

            setGraphData(processFirebaseDataToGraph(fetchedData));
            setRawData(fetchedData); // Update rawData state
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!graphRef.current || !graphData) return;

        const graph = ForceGraph3D()(graphRef.current)
            .graphData(graphData)
            .nodeThreeObject(node => {
                const sprite = new THREE.Sprite(createNodeMaterial(node as GraphNode));
                sprite.scale.set(40, 20, 1);
                return sprite;
            })
            .onNodeClick((node: any) => {
                const graphNode = node as GraphNode;
                toggleNodeExpansion(graphNode.id, graphData, setGraphData, rawData);
                isNodeInteracted.current = true;
            });

        // Setup mouseover functionality
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onMouseMove = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, graph.camera());
            const intersects = raycaster.intersectObjects(graph.scene().children, true);

            if (intersects.length > 0) {
                isNodeInteracted.current = true;
            } else {
                isNodeInteracted.current = false;
            }
        };

        graphRef.current.addEventListener('mousemove', onMouseMove);

        return () => {
            graphRef.current.removeEventListener('mousemove', onMouseMove);
        };
    }, [graphData, onFetchConversation, onNodeClick]);

    return <div ref={graphRef} style={{ width: '100%', height: '100%', position: 'absolute' }} />;
};

export default TopicGraph;
