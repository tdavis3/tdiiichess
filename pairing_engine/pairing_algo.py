import sys
import json

parsedj = json.loads(sys.argv[1])
sectionid = parsedj["sectionid"]  # String
current_round = int(parsedj["pairing_round"])
players_list = parsedj["player_objects"]  # List of Player Objects


def bye_requested(player, curr_round):  # O(1)
    for bye in player['byes']:
        if bye['roundnumber'] == curr_round:
            totalpoints = player['totalpoints']
            player['totalpoints'] = totalpoints + 1
            return True, player
    return False, None


def pairing_algorithm(section_id, current_round, player_obj_list):
    """
    Pairs a round
    :param section_id: String of section ObjectID
    :param current_round: Int
    :param player_obj_list: The list of players in a mongodb Section object
    :return: A list of tuples containing mongodb Resultpairing objects.
    """

    players_to_be_updated = []  # Players in section that will be updated at the end of function
    players_to_be_paired = []  # Players remaining after filtering byes and withdrawals

    for player in player_obj_list:  # Filter players  O(n)
        # if not player['pair'] or player['withdrew']:
        if player['withdrew']:
            continue
        bye_req, updated_player = bye_requested(player, current_round)
        if bye_req:
            players_to_be_updated.append(updated_player)
            continue
        players_to_be_paired.append(player)

    # Sort players by total points  O(nlogn)
    players_to_be_paired.sort(key=lambda x: x['totalpoints'], reverse=True)  # in-place sort

    # Group players by totalpoints
    grouped_by_totalpoints = []  # List of lists
    temp_group = []
    curr_totalpoints = players_to_be_paired[0]["totalpoints"]
    for player in players_to_be_paired:  # O(n)
        if player['totalpoints'] == curr_totalpoints:
            temp_group.append(player)
        else:
            grouped_by_totalpoints.append(temp_group)
            temp_group = []
            curr_totalpoints = player['totalpoints']
            temp_group.append(player)
    if len(temp_group) != 0:
        grouped_by_totalpoints.append(temp_group)
    #  Return grouped_by_totalpoints (List of lists)

    # Sort each group by rating
    sorted_groups = []  # List of lists
    for group in grouped_by_totalpoints:  # O(n)
        group.sort(key=lambda x: x['playerid']['uscfregrating'], reverse=True)  # in-place sort
        sorted_groups.append(group)
    # Return sorted_groups (List of lists)
    return json.dumps(sorted_groups)


    # sorted_groups = [[Player objs with 5 pts], [Player objs with 4.5 pts], [Player objs with 4 pts], ...]
    # Account for previous opponents and preventing playing more than once
    # for group in sorted_groups:  # O(n)
    #     pass
    #
    # return


pairings = pairing_algorithm(sectionid, current_round, players_list)
print(pairings)
# sys.stdout.flush()
# sys.exit(0)
