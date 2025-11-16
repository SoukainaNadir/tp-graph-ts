import { Vertex } from "../model/Vertex";
import { Edge } from "../model/Edge";

export class PathNode {
    vertex: Vertex;
    cost: number;
    reachingEdge: Edge | null;
    visited: boolean;
    
    constructor(vertex: Vertex) {
        this.vertex = vertex;
        this.cost = Number.POSITIVE_INFINITY;
        this.reachingEdge = null;
        this.visited = false;
    }
}