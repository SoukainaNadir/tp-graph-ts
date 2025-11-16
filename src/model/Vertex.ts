import Coordinate from "./Coordinate";
import { Edge } from "./Edge";

/**
 * A vertex in a graph with an id and a location
 */
export class Vertex {
  /**
   * identifier of the vertex (debug purpose)
   */
  id: string;
  /**
   * location of the vertex
   */
  coordinate: Coordinate;

  /**
   * dijkstra - cost to reach a vertex (Number.POSITIVE_INFINITY if the vertex is not reached)
   */
  cost: number;
  /**
   * dijkstra - incoming edge with the best cost
   */
  reachingEdge: Edge | null;
  /**
   * dijkstra - indicates if the vertex is visited
   */
  visited: boolean;

  private _inEdges: Edge[];
  private _outEdges: Edge[];

  constructor() {
    this.id = "";
    this.coordinate = [0, 0];
    this.cost = Number.POSITIVE_INFINITY;
    this.visited = false;
    this.reachingEdge = null;
    this._inEdges = [];
    this._outEdges = [];
  }

  addOutEdge(edge: Edge): void {
    this._outEdges.push(edge);
  }

  addInEdge(edge: Edge): void {
    this._inEdges.push(edge);
  }

  getOutEdges(): Edge[] {
    return this._outEdges;
  }

  getInEdges(): Edge[] {
    return this._inEdges;
  }
}
