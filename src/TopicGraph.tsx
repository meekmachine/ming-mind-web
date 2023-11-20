import React, { useEffect, useRef } from 'react';
import ForceGraph3D from '3d-force-graph';
import { Sprite, SpriteMaterial, CanvasTexture, Color } from 'three';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';

// Define interfaces for graph data
interface GraphNode {
    id: string;
    name: string;
}

interface GraphLink {
    source: string;
    target: string;
    strength: number;
}

interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

interface TopicData {
    [key: string]: number | string | any;
}

interface FirestoreData {
    [id: string]: TopicData;
}

const firebaseConfig = {
    apiKey: "AIzaSyDaLUX0xrk1hND1r3PJ1tiAzG80jmKAFYg",
    authDomain: "ming-527ed.firebaseapp.com",
    projectId: "ming-527ed",
    storageBucket: "ming-527ed.appspot.com",
    messagingSenderId: "78727120574",
    appId: "1:78727120574:web:95eed43cc7579dacdf80ef"
  };

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);

const TopicGraph: React.FC = () => {
    const graphRef = useRef<HTMLDivElement>(null);

    const createTextMaterial = (text: string) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
            context.font = '48px Lucida Sans'; // Updated font and size
            context.fillStyle = 'white';
            context.fillText(text, 0, 48);

            const texture = new CanvasTexture(canvas);
            const material = new SpriteMaterial({ 
                map: texture,
                transparent: true,
                opacity: 0.6 // Set alpha value
            });
            return material;
        }
    };

    const processFirebaseDataToGraph = (data: FirestoreData): GraphData => {
        let nodes: GraphNode[] = [];
        let links: GraphLink[] = [];

        Object.entries(data).forEach(([topicId, topicData]) => {
            if (topicId === '-1') return;  // Exclude node with ID '-1'

            const topicName = topicData.topic_name || `Topic ${topicId}`;
            nodes.push({ id: topicId, name: topicName });

            Object.entries(topicData).forEach(([key, value]) => {
                if (key !== '-1' && !isNaN(Number(key)) && key !== 'conversations') {
                    links.push({
                        source: topicId,
                        target: key,
                        strength: typeof value === 'number' ? value : 0
                    });
                }
            });
        });

        return { nodes, links };
    };

    useEffect(() => {
        if (graphRef.current) {
            const graph = ForceGraph3D()(graphRef.current)
                .nodeThreeObject((node: any) => {
                    const sprite = new Sprite(createTextMaterial(node.name));
                    sprite.scale.set(40, 20, 1); // Increased size
                    return sprite;
                })
                .linkColor((link: any) => {
                    const hue = Math.round((link.source.index + link.target.index) % 360);
                    return `hsl(${hue}, 100%, 50%)`; // Rainbow coloring for edges
                });

            const fetchData = async () => {
                const querySnapshot = await getDocs(collection(firestore, "topics"));
                const data: FirestoreData = {};
                querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
                    data[doc.id] = doc.data() as TopicData;
                });
                const graphData = processFirebaseDataToGraph(data);
                graph.graphData(graphData);

                // Zoom-in effect
                setTimeout(() => {
                    graph.cameraPosition({ z: 150 }, undefined, 2000);
                }, 1000);
            };

            fetchData();
        }
    }, []);

    return <div ref={graphRef} style={{ width: '100%', height: '600px' }} />;
}

export default TopicGraph;
