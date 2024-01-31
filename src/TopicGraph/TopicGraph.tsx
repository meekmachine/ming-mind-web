import React, { useState, useEffect, useRef } from 'react';
import ForceGraph3D from "3d-force-graph";
import * as THREE from 'three';
import { firestore } from './firebase/FirebaseSetup';
import { getDocs, collection, QueryDocumentSnapshot } from 'firebase/firestore';
import { GraphData, TopicData, FirestoreData, GraphNode } from './GraphTypes';
import { createNodeMaterial } from './utils/createNodeMaterial';
import { spinGraph } from './utils/spinGraph';
import { focusCameraOnNode } from './utils/focusCameraOnNode';
import { processFirebaseDataToGraph } from './utils/processFirebaseDataToGraph';
import { toggleNodeExpansion } from './GraphUtilities';

interface TopicGraphProps {
    onFetchConversation: (conversation: { formattedText: string; plainText: string; json: any }) => void;
    onNodeClick: (nodeId: string) => void;
}

const TopicGraph: React.FC<TopicGraphProps> = ({ onFetchConversation, onNodeClick }) => {
    const graphRef = useRef<HTMLDivElement>(null);
    const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
    const [rawData, setRawData] = useState<FirestoreData>({});
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
            setRawData(fetchedData);
        };

        fetchData();
    }, []);

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
                const graphNode = node as GraphNode;
                toggleNodeExpansion(graphNode.id, graphData, setGraphData, rawData);
                isNodeInteracted.current = true;
            });

        const spinInterval = spinGraph(graph, isNodeInteracted);

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onMouseMove = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, graph.camera());

            const intersects = raycaster.intersectObjects(graph.scene().children);
            if (intersects.length > 0) {
                const intersectedNode = intersects[0].object;
                focusCameraOnNode(graph.camera(), { x: intersectedNode.position.x, y: intersectedNode.position.y, z: intersectedNode.position.z }, 2000, 100);
                isNodeInteracted.current = true;
            } else {
                isNodeInteracted.current = false;
            }
        };

        window.addEventListener('mousemove', onMouseMove);

        return () => {
            clearInterval(spinInterval);
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, [graphData, onFetchConversation, onNodeClick]);

    return <div ref={graphRef} style={{ width: '100%', height: '100%', position: 'absolute' }} />;
};

export default TopicGraph;


