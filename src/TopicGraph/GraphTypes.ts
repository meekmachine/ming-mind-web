// GraphTypes.ts
export interface GraphNode {
    id: string;
    name: string;
    color: string;
    average_toxicity_score: number; // Add this property
}


export interface GraphLink {
    source: string;
    target: string;
    strength: number;
    color: string;
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
