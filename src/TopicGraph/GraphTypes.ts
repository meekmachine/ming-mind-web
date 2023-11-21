// GraphTypes.ts
export interface GraphNode {
    id: string;
    name: string;
}

export interface GraphLink {
    source: string;
    target: string;
    strength: number;
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
