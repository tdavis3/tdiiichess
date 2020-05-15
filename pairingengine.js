/** Will determine if a player requested a player for the current round. */
function bye_requested(player, curr_round) {
    for (let bye of player.byes) {
        if (bye.roundnumber === curr_round) {
            player.totalpoints += bye.byepoint;
            return {requested_bye: true, updated_player: player};
        }
    }
    return {requested_bye: false, updated_player: null};
}

/**
 * Filters out the players who are not to be paired.
 * @param {Array} player_objs - All player objects.
 * @return {Object} All players to be paired and any that need to be updated.
 */
function filter_players(player_objs) {
    let players_to_be_updated = [];
    let players_to_be_paired = [];
    for (let player of player_objs) {
        if (player.withdrew || !player.pair) {
            continue;
        }
        const {requested_bye, updated_player} = bye_requested(player, curr_round);
        if (requested_bye) {
            players_to_be_updated.push(updated_player);
            continue;
        }
        players_to_be_paired.push(player);
    }
    return {
        players_to_be_paired: players_to_be_paired,
        players_to_be_updated: players_to_be_updated
    };
}


/**
 * Returns an array  of pairings  for the curr_round in a section.
 * @function
 * @param {string} section_id - The MongoID of the section.
 * @param {int} curr_round - The current round.
 * @param {Array} player_objs - An array of all the player objs in the section.
 * @return {Array} An array of Resultpairing objects.
 */
function pairing_algorithm(section_id, curr_round, player_objs) {

    // let players_to_be_updated = [];  // Players in section that will be updated at the end of function

    // Players remaining after filtering (byes, withdrawals, pair)
    let {players_to_be_paired, players_to_be_updated} = filter_players(player_objs);

    // Sort players by totalpoints
    players_to_be_paired.sort((p1, p2) => p1.totalpoints - p2.totalpoints);

    // Group players by totalpoints
    let grouped_by_totalpoints = [];  // List of lists
    let temp_group = [];
    let curr_totalpoints = players_to_be_paired[0].totalpoints;
    for (let player of players_to_be_paired) {
        if (player.totalpoints === curr_totalpoints) {
            temp_group.push(player);
        } else {
            grouped_by_totalpoints.push(temp_group);
            temp_group = [];
            curr_totalpoints = player.totalpoints;
            temp_group.push(player);
        }
    }
    if (temp_group.length !== 0) {
        grouped_by_totalpoints.push(temp_group);
    }
    // Return grouped_by_totalpoints (Array of arrays)

    // Sort each group by rating
    let sorted_groups = [];  // List of lists
    for (let group of grouped_by_totalpoints) {
        group.sort((p1, p2) => parseInt(p1.playerid.uscfregrating) - parseInt(p2.playerid.uscfregrating));
        sorted_groups.push(group);
    }
    // Return sorted_groups (Array of arrays)

    let pairings = [];
    for (let i = 0; i < sorted_groups.length; i++) {
        if (sorted_groups[i].length % 2 === 0) {
            for (let j = 0; j === sorted_groups[i].length / 2; j++) {
                pairings.push({p1: sorted_groups[i][j], p2: sorted_groups[i][sorted_groups[i].length - (1 + j)]});
            }
        } else {
            sorted_groups[i].pop()
        }
    }
}

module.exports = pairing_algorithm;
