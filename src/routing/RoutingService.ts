import { Vertex } from "../model/Vertex";
import { Graph } from "../model/Graph";
import { Edge } from "../model/Edge";
import { RouteNotFound } from "../errors/RouteNotFound";
import { PathNode } from "./PathNode";

/**
 * Find routes using Dijkstra's algorithm.
 *
 * @see https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
 */
export class RoutingService {
  private nodes: Map<Vertex, PathNode>;

  constructor(private graph: Graph) {
    this.nodes = new Map();
  }

  /**
   * Find a route between an origin and a destination
   */
  findRoute(origin: Vertex, destination: Vertex): Edge[] {
    // prepare graph for the visit
    this.initGraph(origin);

    // visit all vertices
    let current: Vertex | null;
    while ((current = this.findNextVertex()) != null) {
      this.visit(current);

      const destNode = this.getNode(destination);
      if (destNode.cost !== Number.POSITIVE_INFINITY) {
        return this.buildRoute(destination);
      }
    }

    throw new RouteNotFound(
      `no route found from '${origin.id}' to '${destination.id}'`
    );
  }

  /**
   * Prepare the graph to find a route from an origin.
   */
  private initGraph(origin: Vertex): void {
    this.nodes.clear();
    for (const vertex of this.graph.vertices) {
      const node = new PathNode(vertex);
      if (vertex === origin) {
        node.cost = 0.0;
      }
      this.nodes.set(vertex, node);
    }
  }
  /**
   * Explores out edges for a given vertex and try to reach vertex with a better cost.
   */

  private getNode(vertex: Vertex): PathNode {
    let node = this.nodes.get(vertex);
    if (!node) {
      node = new PathNode(vertex);
      this.nodes.set(vertex, node);
    }
    return node;
  }

  private visit(vertex: Vertex): void {
    const currentNode = this.getNode(vertex);

    for (const outEdge of this.graph.getOutEdges(vertex)) {
      const reachedVertex = outEdge.getTarget();
      const reachedNode = this.getNode(reachedVertex);

      /*
       * Test if reachedVertex is reached with a better cost.
       * (Note that the cost is POSITIVE_INFINITY for unreached vertex)
       */
      const newCost = currentNode.cost + outEdge.getLength();
      if (newCost < reachedNode.cost) {
        reachedNode.cost = newCost;
        reachedNode.reachingEdge = outEdge;
      }
    }
    // mark vertex as visited
    currentNode.visited = true;
  }
  /**
   * Find the next vertex to visit. With Dijkstra's algorithm,
   * it is the nearest vertex of the origin that is not already visited.
   */
   private findNextVertex(): Vertex | null {
    let candidate: Vertex | null = null;
    let candidateNode: PathNode | null = null;

    for (const vertex of this.graph.vertices) {
      const node = this.getNode(vertex);

      // already visited?
      if (node.visited) {
        continue;
      }
      // not reached?
      if (node.cost === Number.POSITIVE_INFINITY) {
        continue;
      }
      // nearest from origin?
      if (candidateNode === null || node.cost < candidateNode.cost) {
        candidate = vertex;
        candidateNode = node;
      }
    }
    return candidate;
  }

  /**
   * Build route to the reached destination.
   */
  private buildRoute(destination: Vertex): Edge[] {
    const edges: Edge[] = [];
    let currentNode = this.getNode(destination);

    while (currentNode.reachingEdge !== null) {
      edges.push(currentNode.reachingEdge);
      const sourceVertex = currentNode.reachingEdge.getSource();
      currentNode = this.getNode(sourceVertex);
    }

    return edges.reverse();
  }
}
