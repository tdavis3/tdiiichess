/*
    Graph class
 */

module.exports = class Graph {
    // defining vertex array and adjacent list
    constructor(noOfVertices) {
        this.noOfVertices = noOfVertices;
        this.AdjList = new Map();
    }

    getVertices() {
        return [...this.AdjList.keys()];
    }

    /**
     * Add node to graph
     * @param {Number} n - node
     * @return Void
     */
    addNode(n) {  // initialize the adjacent list with a null array
        this.AdjList.set(n, []);
    }

    /**
     * Add edge to graph
     * @param {Number} u - source node
     * @param {Number} v - destination node
     * @param {Number} w - weight of edge
     * @return Void
     */
    addEdge(u, v, w) {
        // get the list for vertex u and put the node v denoting edge between u and v
        this.AdjList.get(u).push(v);

        // Since graph is undirected, add an edge from v to u also
        this.AdjList.get(v).push(u);
    }

    printGraph() {

        const get_keys = this.AdjList.keys();  // get all the vertices

        // iterate over the vertices
        for (const i of get_keys) {
            // great the corresponding adjacency list
            // for the vertex
            const get_values = this.AdjList.get(i);
            let conc = "";

            // iterate over the adjacency list and concatenate the values into a string
            for (const j of get_values)
                conc += j + " ";

            // print the vertex and its adjacency list
            console.log(i + " -> " + conc);
        }
    }
}
