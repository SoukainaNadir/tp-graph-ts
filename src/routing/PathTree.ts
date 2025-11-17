import { Graph } from "../model/Graph";
import { Vertex } from "../model/Vertex";
import { Edge } from "../model/Edge";
import { PathNode } from "./PathNode";

export class PathTree {
  private nodes: Map<Vertex, PathNode>;

  constructor(graph: Graph, origin: Vertex) {
    this.nodes = new Map();

    for (const vertex of graph.vertices) {
      const node = new PathNode(vertex);
      if (vertex === origin) {
        node.cost = 0.0;
      }
      this.nodes.set(vertex, node);
    }
  }

  getNode(vertex: Vertex): PathNode {
    const node = this.nodes.get(vertex);
    if (!node) {
      throw new Error(`Vertex ${vertex.id} not found in path tree`);
    }
    return node;
  }

  getPath(destination: Vertex): Edge[] {
    const edges: Edge[] = [];
    let currentNode = this.getNode(destination);

    while (currentNode.reachingEdge !== null) {
      edges.push(currentNode.reachingEdge);
      const sourceVertex = currentNode.reachingEdge.getSource();
      currentNode = this.getNode(sourceVertex);
    }

    return edges.reverse();
  }

  getVertices(): Vertex[] {
    return Array.from(this.nodes.keys());
  }
}
