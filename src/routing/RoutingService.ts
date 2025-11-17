import { Vertex } from "../model/Vertex";
import { Graph } from "../model/Graph";
import { Edge } from "../model/Edge";
import { RouteNotFound } from "../errors/RouteNotFound";
import { PathNode } from "./PathNode";
import { PathTree } from "./PathTree";

/**
 * Find routes using Dijkstra's algorithm.
 *
 * @see https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
 */
export class RoutingService {
  constructor(private graph: Graph) {}

  /**
   * Find a route between an origin and a destination
   */
  findRoute(origin: Vertex, destination: Vertex): Edge[] {
    const pathTree = new PathTree(this.graph, origin);

    let current: Vertex | null;
    while ((current = this.findNextVertex(pathTree)) !== null) {
      this.visit(current, pathTree);

      // until the destination is reached...
      const destNode = pathTree.getNode(destination);
      if (destNode.cost !== Number.POSITIVE_INFINITY) {
        return pathTree.getPath(destination);
      }
    }

    throw new RouteNotFound(
      `no route found from '${origin.id}' to '${destination.id}'`
    );
  }

  /**
   * Explores out edges for a given vertex and try to reach vertex with a better cost.
   */

  private visit(vertex: Vertex, pathTree: PathTree): void {
    const currentNode = pathTree.getNode(vertex);

    for (const outEdge of this.graph.getOutEdges(vertex)) {
      const reachedVertex = outEdge.getTarget();
      const reachedNode = pathTree.getNode(reachedVertex);

      const newCost = currentNode.cost + outEdge.getLength();
      if (newCost < reachedNode.cost) {
        reachedNode.cost = newCost;
        reachedNode.reachingEdge = outEdge;
      }
    }
    currentNode.visited = true;
  }
  /**
   * Find the next vertex to visit. With Dijkstra's algorithm,
   * it is the nearest vertex of the origin that is not already visited.
   */
  private findNextVertex(pathTree: PathTree): Vertex | null {
    let candidate: Vertex | null = null;
    let candidateNode = null;

    for (const vertex of pathTree.getVertices()) {
      const node = pathTree.getNode(vertex);

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
}
