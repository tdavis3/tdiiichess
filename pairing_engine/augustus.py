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
        self.round = int(roundNumber)
        self.sectionPlayers = sectionPlayers
        self.groups = {k: list(v) for k, v in groupby(sorted(sectionPlayers, key=lambda p: p['total_points']),
                                                      key=lambda x: x['total_points'])}
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
        if (currentScoreGroup > self.round):
            nextScoreGroup = currentScoreGroup - 1
        elif (currentScoreGroup < self.round):
            nextScoreGroup = currentScoreGroup + 1
        else:
            nextScoreGroup = currentScoreGroup

        hasNextScoregroup = nextScoreGroup / 2 in self.groups
        for i in range(len(players) - 1, -1, -1):  # Add in reverse order to preserve decreasing order by rating
            player = players[i]
            player['floater'] = True
            #  This is adding a reference of the object so the object in the previous group will also update as well
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
    def pairwise(indices):  # Get all pairs of elements of a list - Recursive
        if (len(indices) < 2):
            return []
        first = indices[0]
        rest = indices[1:]
        pairs = list(map(lambda x: [first, x], rest))
        return pairs + Pairing.pairwise(rest)

    def filterOutCollisions(self, pairs):  # Filter out pairs of players that have already played (collision)
        return list(
            filter(lambda pair: self.groups[self.K / 2][pair[0] - 1].get('player_id') not in self.groups[self.K / 2][
                pair[1] - 1].get('previous_opponents'), pairs))

    def get_unpaired_players(self, matching, pointGroup):
        unpaired = []
        flattened_result = [item for t in matching for item in t]
        for player in self.groups[pointGroup]:
            if player['player_id'] not in flattened_result:
                unpaired.append(player)
        return unpaired

    def generatePairings(self):
        for scoreGroup in Pairing.getOrdering(self.round):
            playersInGroup = self.groups.get(scoreGroup / 2)
            if (playersInGroup == None):
                continue
            self.K = scoreGroup
            self.M = len(playersInGroup)
            self.m = Pairing.numberOfFloaters(playersInGroup)
            allPossibleEdges = Pairing.pairwise(list(range(1, self.M + 1)))
            finalEdges = self.filterOutCollisions(allPossibleEdges)
            if (len(finalEdges) == 0):
                self.transfer(playersInGroup, scoreGroup)

            # Create graph
            g = Graph()
            for i in range(0, self.M):
                g.add_node(playersInGroup[i]['player_id'])
            for edge in finalEdges:
                weight = 5000 - self.penaltyPoints(edge[0], edge[1])
                g.add_edge(playersInGroup[edge[0] - 1]['player_id'], playersInGroup[edge[1] - 1]['player_id'],
                           weight=weight)
            result = max_weight_matching(g, maxcardinality=True)  # Edmonds Blossom algorithm
            unpaired_players = self.get_unpaired_players(result, scoreGroup / 2)  # Get any unpaired players
            if len(unpaired_players) > 0: self.transfer(unpaired_players, scoreGroup)  # Transfer them to next group
            # Might need to do some more processing of the result here
            self.pairings = self.pairings + list(result)
        return self.pairings
