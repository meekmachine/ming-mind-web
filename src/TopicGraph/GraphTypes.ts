export interface GraphNode {
    id: string;
    name: string;
    color: string;
    average_toxicity_score: number; 
    x: number;  // X-coordinate of the node
    y: number;  // Y-coordinate of the node
    z: number;  // Z-coordinate of the node
    // Add any other properties that GraphNode might have
}

export interface GraphLink {
    source: string;
    target: string;
    strength: number;
    color: string;
    // Add any other properties that GraphLink might have
}

export interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

export interface TopicData {
    [key: string]: number | string | any;
}

export interface FirestoreData {
    [id: string]: TopicData;
}
