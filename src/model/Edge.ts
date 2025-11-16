import { LineString } from "geojson";
import { Vertex } from "./Vertex";
import length from "@turf/length";
import { lineString } from "@turf/turf";

/**
 * An edge with its source and target
 */
export class Edge {
  id: string;
  private _source: Vertex;
  private _target: Vertex;
  private geometry?: LineString;

  constructor(source: Vertex, target: Vertex) {
    if (!source) {
      throw new Error("Edge source cannot be null or undefined");
    }
    if (!target) {
      throw new Error("Edge target cannot be null or undefined");
    }

    this._source = source;
    this._target = target;

    source.addOutEdge(this);
    target.addInEdge(this);
  }

  getSource(): Vertex {
    return this._source;
  }

  getTarget(): Vertex {
    return this._target;
  }

  setGeometry(geometry: LineString): void {
    this.geometry = geometry;
  }

  getLength(): number {
    return length(lineString(this.getGeometry().coordinates));
  }

  getGeometry(): LineString {
    if (this.geometry) {
      return this.geometry;
    }
    return {
      type: "LineString",
      coordinates: [this._source.coordinate, this._target.coordinate],
    };
  }
}
