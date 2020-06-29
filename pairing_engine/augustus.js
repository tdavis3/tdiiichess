const Graph = require('./graph');
const groupBy = require('lodash.groupby');
const range = require('lodash.range');

/*
"Augustus"

Based on the paper "Weighted Matching in Chess Tournaments" by Snjolfur Olafsson

 */


class Pairing {

    // Constants
    static #c1 = 25;
    static #c2 = 500;
    static #c3 = 10;
    static #c4 = 25;
    static #c5 = 8;

    #M;
    #m;
    #K;

    constructor(sectionId, roundNumber, sectionPlayers) {
        this.sectionId = sectionId;
        this.round = roundNumber;
        this.sectionPlayers = sectionPlayers;
        this.groups = groupBy(sectionPlayers, 'total_points');
    }

    colorNumber(i) { // Gets the color number of player i
        const player = this.groups[this.#K / 2][i - 1];
        return player.number_white - player.number_black;
    }

    score(i) {  // Gets the score (total_points) of player i
        const player = this.groups[this.#K / 2][i - 1];
        return player.total_points * 2;  // Convert from W=1, D=.5, L=0 to W=2, D=1, L=0
    }

    scoreDifference(i, j) {  // Gets the score difference between player i and j
        return Math.abs(this.score(i) - this.score(j));
    }

    oldFloater(i, j) {
        return (this.score(i) === this.score(j) && this.score(j) === this.#K) ? 0 : (Pairing.#c1 * this.scoreDifference(i, j) * Math.abs(i - j) - Pairing.#c2)
    }

    newFloater(i, j) {
        return Pairing.#c3 * (i + j)
    }

    colorPenaltyPoints(i, j) {
        const P = Math.min(Math.abs(this.colorNumber(i)), Math.abs(this.colorNumber(j)));
        return (Pairing.#c4 * Math.pow(Pairing.#c5, P)) ? ((this.colorNumber(i) * this.colorNumber(j)) > 0) : 0
    }

    halvesSituation(i, j) {
        const B = (this.#M - 2 * this.#m) / 2;
        return (this.score(i) === this.score(j) && this.score(j) === this.#K) ? Math.pow(B - Math.abs(i - j), 2) : 0
    }

    penaltyPoints(i, j) {  // Gets the penalty points of a pairing
        return this.oldFloater(i, j) + this.newFloater(i, j) + this.colorPenaltyPoints(i, j) + this.halvesSituation(i, j)
    }

    static getOrdering(round) {  // Pairing order in Figure 1
        return range(2 * round, round, -1).concat(range(0, round), round);
    }

    transfer(players, currentScoreGroup) {  // Transfer floaters
        let nextScoreGroup = null;
        if (currentScoreGroup > this.round) {
            nextScoreGroup = currentScoreGroup - 1;
        } else if (currentScoreGroup < this.round) {
            nextScoreGroup = currentScoreGroup + 1;
        } else {
            nextScoreGroup = currentScoreGroup;
        }
        const hasNextScoregroup = this.groups.hasOwnProperty(nextScoreGroup);
        for (let i = players.length - 1; i >= 0; i--) {  // Add in reverse order to preserve decreasing order by rating
            let player = players[i];
            player.floater = true;
            if (hasNextScoregroup) {
                this.groups[nextScoreGroup / 2].unshift(player);  // Push to front of array
            } else {
                this.groups[nextScoreGroup / 2] = [player];
            }
        }
    }

    static numberOfFloaters(players) {
        let count = 0;
        players.forEach(player => {
            count += player.floater ? 1 : 0;
        });
        return count;
    }

    static pairwise(list) {  // Get all pairs of elements of an Array - Recursive
        if (list.length < 2) {
            return [];
        }
        const first = list[0], rest = list.slice(1), pairs = rest.map(function (x) {
            return [first, x];
        });
        return pairs.concat(Pairing.pairwise(rest));
    }

    /**
     * Filters out the pairs that have already played each other.
     * @param {Array} pairs - Array of length 2 arrays
     * @return {Array} Pairs of players that have not played each other yet
     */
    filterOutCollisions(pairs) {
        return pairs.filter(pair => {
            const player1 = this.groups[this.#K / 2][pair[0] - 1];
            const player2 = this.groups[this.#K / 2][pair[1] - 1];
            return !player2.previous_opponents.includes(player1.player_id);  // Or player.player_id._id
        });
    }

    generatePairings() {
        for (const scoreGroup of Pairing.getOrdering(this.round)) {
            const playersInGroup = this.groups[scoreGroup / 2];
            if (playersInGroup === undefined) continue;
            this.#K = scoreGroup;
            this.#M = playersInGroup.length;  // The number of players in the current group
            this.#m = Pairing.numberOfFloaters(playersInGroup);
            const allPossibleEdges = Pairing.pairwise(range(1, this.#M + 1));
            const finalEdges = this.filterOutCollisions(allPossibleEdges);
            if (finalEdges.length === 0) {
                this.transfer(playersInGroup, scoreGroup);
            }

            let g = new Graph(this.#M);
            for (const i of range(1, this.#M + 1)) {  // Add players to graph
                g.addNode(i);
            }
            for (const edge of finalEdges) {  // Add edges and their weights
                const weight = 5000 - this.penaltyPoints(edge[0], edge[1]);
                g.addEdge(edge[0], edge[1], weight);
            }

            // Run Edmonds Blossom

            // Transfer any unpaired players
        }
    }
}

module.exports = Pairing;
