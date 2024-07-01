import { v4 as uuidv4 } from "uuid";
import { fastUUID } from "./utils";

import Base from "./Base";

export default class Node extends Base {
    constructor(input, hyperedge) {
        super();
        this.input = input;
        this.uuid = fastUUID();
        this.hyperedge = hyperedge;
        this.hypertext = new Hypertext(this);
        this.isNode = true;
    }

    get symbol() {
        return this.input.trim();
    }
    set symbol(symbol) {
        this.input = symbol;
    }
    get name() {
        return this.constructor.name.toLowerCase();
    }
    get index() {
        return this.hyperedge.nodes.indexOf(this);
    }
    get only() {
        return this.hyperedge.length === 1;
    }
    get id() {
        return this.hyperedge.nodeId(this.index);
    }
    get uid() {
        return this.hyperedge.uniqueNodeId(this.index);
    }
    get tree() {
        return this.hyperedge.tree;
    }
    get hypertexts() {
        return this.hypertext.all;
    }
    get isFirst() {
        return this.index === 0;
    }
    get isLast() {
        return this.index === this.hyperedge.length - 1;
    }
    get isMiddle() {
        return !this.isFirst && !this.isLast;
    }
    get color() {
        return this.hyperedge.color;
    }
    get output() {
        if (this.input === "") {
            return this.input;
        } else if (this.only) {
            if (this.input !== this.input.trim()) return this.input.trim();
            return this.input;
        } else if (this.isFirst) {
            if (this.input[this.input.length - 1] === " ") return this.input;
            return `${this.symbol} `;
        } else if (this.isLast) {
            if (this.input[0] === " ") return this.input;
            return ` ${this.symbol}`;
        } else if (this.isMiddle) {
            if (this.input[0] === " " && this.input[this.input.length - 1] === " ")
                return this.input;
            return ` ${this.symbol} `;
        }
    }

    get dom() {
        return (
            <a
                onClick={() => window.setActiveNodeUUID(this.uuid)}
                style={{ color: this.color }}
                className="node"
                key={`node-${this.uuid}`}>
                {this.output}
            </a>
        );
    }

    equal(node) {
        return this.id === node.id;
    }
    equals(symbol) {
        return this.symbol.toLowerCase() === symbol.toLowerCase();
    }

    rename(symbol) {
        this.symbol = symbol;
        this.tree.onUpdate({ event: "node.rename", data: this });
        return this.id;
    }

    add(input) {
        this.hyperedge.insertAt(input, this.index + 1);
    }
    insert(input) {
        this.hyperedge.insertAt(input, this.index);
    }
    remove() {
        this.hyperedge.removeAt(this.index);

        if (this.hyperedge.length === 0) {
            this.hyperedge.remove();
        }
    }

    get str() {
        return `${this.index}:node ${this.symbol} [${this.uuid}]`;
    }

    connect(node) {
        return this.tree.add([this.symbol, node.symbol]);
    }

    context(data) {
        const context = {
            prev: [],
            next: [],
            stack: [],
        };

        for (const link of data.links) {
            // force 3d graph modifies data...kinda crummy, would be better to store datainternally rather than passing it around
            let source = link.source.id || link.source;
            let target = link.target.id || link.target;

            if (source === this.id) {
                if (link.bridge) {
                    for (const node of link.nodes) {
                        if (node !== this) {
                            context.next.push(node);
                        }
                    }
                } else {
                    context.next.push(this.tree.nodeByID(target));
                }
            } else if (target === this.id) {
                if (link.bridge) {
                    for (const node of link.nodes) {
                        if (node !== this) {
                            context.prev.push(node);
                        }
                    }
                } else {
                    context.prev.push(this.tree.nodeByID(source));
                }
            }
        }

        for (const node of data.nodes) {
            if (!node.nodes.includes(this)) continue;
            for (const n of node.nodes) {
                context.stack.push(n);
            }
        }

        return context;
    }

    // updateIndexes(nodes) {
    //     const node = this.hypergraph.masqueradeNode(this);

    //     const existing = nodes.get(node.id);

    //     const edgeIDs = existing ? existing.edgeIDs : new Set();
    //     edgeIDs.add(this.hyperedge.id);
    //     edgeIDs.add(node.hyperedge.id);

    //     const edgeUUIDs = existing ? existing.edgeUUIDs : new Set();
    //     edgeUUIDs.add(this.hyperedge.uuid);
    //     edgeUUIDs.add(node.hyperedge.uuid);

    //     const nodeIDs = existing ? existing.nodeIDs : new Set();
    //     nodeIDs.add(this.id);
    //     nodeIDs.add(node.id);

    //     const nodeUUIDs = existing ? existing.nodeUUIDs : new Set();
    //     nodeUUIDs.add(this.uuid);
    //     nodeUUIDs.add(node.uuid);

    //     return {
    //         edgeIDs,
    //         edgeUUIDs,
    //         nodeIDs,
    //         nodeUUIDs,
    //     }
    // }
}

// local Node-only Hypertext
class Hypertext {
    constructor(node) {
        this.node = node;
    }

    get tree() {
        return this.node.tree;
    }

    add(input) {
        return this.tree.hypertexts.add(this.node.symbol, input);
    }

    get all() {
        return this.tree.hypertexts.get(this.node.symbol);
    }
}