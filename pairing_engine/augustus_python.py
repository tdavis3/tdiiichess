from itertools import groupby
from networkx import max_weight_matching, Graph


class Pairing:
    # Constants
    c1 = 25
    c2 = 500
    c3 = 10
    c4 = 25
    c5 = 8

    M = None
    m = None
    K = None

    def __init__(self, sectionId, roundNumber, sectionPlayers):
        self.sectionId = sectionId
        self.round = roundNumber
        self.sectionPlayers = sectionPlayers
        self.groups = {k: list(v) for k, v in groupby(sectionPlayers, key=lambda x: x['total_points'])}
        self.pairings = []

    def colorNumber(self, i):  # Gets the color number of player i
        player = self.groups[self.K / 2][i - 1]
        return player.get('number_white') - player.get('number_black')

    def score(self, i):  # Gets the score (total_points) of player i
        player = self.groups[self.K / 2][i - 1]
        return player.get('total_points') * 2  # Convert from W=1, D=.5, L=0 to W=2, D=1, L=0

    def scoreDifference(self, i, j):  # Gets the score difference between player i and j
        return abs(self.score(i) - self.score(j))

    def oldFloater(self, i, j):
        return 0 if (self.score(i) == self.score(j) and self.score(j) == self.K) else (
                Pairing.c1 * self.scoreDifference(i, j) * abs(i - j) - Pairing.c2)

    def newFloater(self, i, j):
        return Pairing.c3 * (i + j)

    def colorPenaltyPoints(self, i, j):
        P = min(abs(self.colorNumber(i)), abs(self.colorNumber(j)))
        return ((self.colorNumber(i) * self.colorNumber(j)) > 0) if (Pairing.c4 * Pairing.c5 ** P) else 0

    def halvesSituation(self, i, j):
        B = (self.M - 2 * self.m) / 2
        return (B - abs(i - j) ** 2) if (self.score(i) == self.score(j) and self.score(j) == self.K) else 0

    def penaltyPoints(self, i, j):  # Gets the penalty points of a pairing
        return self.oldFloater(i, j) + self.newFloater(i, j) + self.colorPenaltyPoints(i, j) + self.halvesSituation(i,
                                                                                                                    j)

    @staticmethod
    def getOrdering(round):  # Pairing order in Figure 1
        return list(range(2 * round, round, -1)) + list(range(0, round)) + [round]

    def transfer(self, players, currentScoreGroup):  # Transfer floaters
        nextScoreGroup = None
        if (currentScoreGroup > self.round):
            nextScoreGroup = currentScoreGroup - 1
        elif (currentScoreGroup < self.round):
            nextScoreGroup = currentScoreGroup + 1
        else:
            nextScoreGroup = currentScoreGroup

        hasNextScoregroup = nextScoreGroup in self.groups
        for i in range(len(players) - 1, -1, -1):  # Add in reverse order to preserve decreasing order by rating
            player = players[i]
            player['floater'] = True
            if (hasNextScoregroup):
                self.groups[nextScoreGroup / 2].insert(0, player)  # Push to front of array
            else:
                self.groups[nextScoreGroup / 2] = [player]

    @staticmethod
    def numberOfFloaters(players):
        count = 0
        for player in players:
            count += 1 if player.get('floater', False) else 0
        return count

    @staticmethod
    def pairwise(indices):  # Get all pairs of elements of an Array - Recursive
        if (len(indices) < 2):
            return []
        first = indices[0]
        rest = indices[1:]
        pairs = list(map(lambda x: [first, x], rest))
        return pairs + Pairing.pairwise(rest)

    def filterOutCollisions(self, pairs):
        return list(
            filter(lambda pair: self.groups[self.K / 2][pair[0] - 1].get('player_id') not in self.groups[self.K / 2][
                pair[1] - 1].get('previous_opponents'), pairs))

    def generatePairings(self):
        for scoreGroup in Pairing.getOrdering(self.round):
            playersInGroup = self.groups.get(scoreGroup / 2)
            if (playersInGroup == None):
                continue
            self.K = scoreGroup
            self.M = len(playersInGroup)  # The number of players in the current group
            self.m = Pairing.numberOfFloaters(playersInGroup)
            allPossibleEdges = Pairing.pairwise(list(range(1, self.M + 1)))
            finalEdges = self.filterOutCollisions(allPossibleEdges)
            if (len(finalEdges) == 0):
                self.transfer(playersInGroup, scoreGroup)

            # Create graph
            g = Graph()
            for i in range(1, self.M + 1):
                g.add_node(i)
            for edge in finalEdges:
                weight = 5000 - self.penaltyPoints(edge[0], edge[1])
                # print(weight)
                g.add_edge(edge[0], edge[1], weight=weight)

            # Run Edmonds Blossom
            result = max_weight_matching(g, maxcardinality=True)

            # Map the matching from indices back to MongoIDs
            # Add the generated pairings to self.pairings

            # Transfer any unpaired players

            print('----------------')
            print('Result of Matching: ')
            print(result)
            print(f'No. floaters: {self.m}')
            print(playersInGroup)
            print(f'ScoreGroup: {scoreGroup}')
            print(f'No. players in group: {self.M}')
            print('Edges:')
            print(allPossibleEdges)
            print('Final Edges:')
            print(finalEdges)


if __name__ == "__main__":
    test_players = [
        {
            "withdrew": True,
            "able_to_pair": True,
            "number_white": 1,
            "number_black": 1,
            "_id": "5ef5634ac8a140b0b45d2287",
            "player_id": "5ef5634ac8a140b0b45d2286",
            "total_points": 2,
            "byes": [],
            "previous_opponents": []
        }, {
            "withdrew": False,
            "able_to_pair": True,
            "number_white": 2,
            "number_black": 0,
            "_id": "5ef81807499d8a21249acb83",
            "player_id": "5ef81807499d8a21249acb82",
            "total_points": 2,
            "byes": [],
            "previous_opponents": []
        }, {
            "withdrew": False,
            "able_to_pair": True,
            "number_white": 1,
            "number_black": 1,
            "_id": "5ef81840a0c06e6238ae867e",
            "player_id": "5ef81840a0c06e6238ae867d",
            "total_points": 1.5,
            "byes": [],
            "previous_opponents": []
        }, {
            "withdrew": False,
            "able_to_pair": True,
            "number_white": 0,
            "number_black": 2,
            "_id": "5ef81852a0c06e6238ae8680",
            "player_id": "5ef81852a0c06e6238ae867f",
            "total_points": 1,
            "byes": [],
            "previous_opponents": []
        }, {
            "withdrew": False,
            "able_to_pair": True,
            "number_white": 1,
            "number_black": 1,
            "_id": "5ef8189699cf60707024e9d8",
            "player_id": "5ef8189599cf60707024e9d7",
            "total_points": 1,
            "byes": [],
            "previous_opponents": ["5ef818c744f3966c6c142e9b"]
        }, {
            "withdrew": False,
            "able_to_pair": True,
            "number_white": 1,
            "number_black": 1,
            "_id": "5ef818c744f3966c6c142e9c",
            "player_id": "5ef818c744f3966c6c142e9b",
            "total_points": 1,
            "byes": [],
            "previous_opponents": ["5ef819ed9f07705df00de11d", "5ef8189599cf60707024e9d7"]
        }, {
            "withdrew": False,
            "able_to_pair": True,
            "number_white": 1,
            "number_black": 1,
            "_id": "5ef819ed9f07705df00de11e",
            "player_id": "5ef819ed9f07705df00de11d",
            "total_points": .5,
            "byes": [],
            "previous_opponents": ["5ef818c744f3966c6c142e9b"]
        }, {
            "withdrew": False,
            "able_to_pair": True,
            "number_white": 1,
            "number_black": 1,
            "_id": "5ef81e0513398e690494faf8",
            "player_id": "5ef81e0513398e690494faf7",
            "total_points": .5,
            "byes": [],
            "previous_opponents": []
        }
    ]
    augustusEngine = Pairing(1, 2, test_players)
    augustusEngine.generatePairings()
