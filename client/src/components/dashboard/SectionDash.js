import React, {useEffect} from "react";
import PropTypes from "prop-types";
import SectionDashNavbar from "../layout/SectionDashNavbar";
import {connect} from "react-redux";
import {getCurrentPlayers, deletePlayer} from "../../actions/players";
import EnhancedTable from "../layout/EnhancedTable";
import Box from "@material-ui/core/Box";
import CssBaseline from "@material-ui/core/CssBaseline";
import AddPlayerDialog from "../tournament-forms/AddPlayerDialog";
import EditPlayerDialog from "../tournament-forms/EditPlayerDialog";
import Typography from "@material-ui/core/Typography";

const SectionDash = props => {
    useEffect(() => {
        props.getCurrentPlayers(props.location.state.section._id);
    }, []);

    const columns = React.useMemo(
        () => [
            {
                Header: 'Players',
                columns: [
                    {
                        Header: 'Info',
                        accessor: 'playerid',
                        Cell: ({cell}) => {
                            const player = cell.value;
                            return (
                                <Box>
                                    <Typography>
                                        {player.firstname.concat(" ", player.lastname)}
                                    </Typography>
                                    <Typography>{player.uscfregrating}</Typography>
                                    <Typography>{player.uscfid}</Typography>

                                </Box>
                            );
                        }
                    },
                ]
            },
            {
                Header: 'Rounds',
                columns: [
                    {
                        Header: '1',
                        accessor: 'round1',
                    },
                    {
                        Header: '2',
                        accessor: 'round2',
                    },
                ]
            }
        ],
        []
    );

    const data = React.useMemo(() => props.players.players, [props.players.players]);

    return (
        <div>
            <CssBaseline/>
            <SectionDashNavbar currentsection={props.location.state.section}/>
            <EnhancedTable
                title={'Players'}
                parent_id={props.location.state.section._id}
                columns={columns}
                data={data}
                deleteaction={props.deletePlayer}
                CreateDialog={AddPlayerDialog}
                EditDialog={EditPlayerDialog}
            />
        </div>
    );

    // const [checkData, setCheckData] = useState({checkedPlayers: []});
    //
    // const clearCheckData = () => {
    //     setCheckData({checkedPlayers: []});
    // };
    //
    // const onChange = e => {
    //     if (e.target.checked) {
    //         setCheckData({
    //             checkedPlayers: [
    //                 e.currentTarget.getAttribute("data-id"),
    //                 ...checkData.checkedPlayers
    //             ]
    //         });
    //     } else {
    //         const players = checkData.checkedPlayers.filter(
    //             id => id !== e.currentTarget.getAttribute("data-id")
    //         );
    //         setCheckData({checkedPlayers: players});
    //     }
    // };
    //
    // const players_list = props.players.players.map((player, index) => (
    //     <tr key={player.playerid._id}>
    //         <td>
    //             <div className="custom-control custom-checkbox">
    //                 <input
    //                     type="checkbox"
    //                     className="custom-control-input"
    //                     data-id={player.playerid._id}
    //                     id={"customCheck" + index.toString()}
    //                     onChange={e => onChange(e)}
    //                 />
    //                 <label
    //                     className="custom-control-label"
    //                     htmlFor={"customCheck" + index.toString()}
    //                 >
    //                     {index + 1}
    //                 </label>
    //             </div>
    //         </td>
    //         <td>{player.playerid.firstname.concat(" ", player.playerid.lastname)}</td>
    //         <td>{player.playerid.uscfregrating}</td>
    //         <td>{player.playerid.uscfid}</td>
    //     </tr>
    // ));
    //
    // return (
    //     <Fragment>
    //         <SectionDashNavbar currentsection={props.location.state.section}/>
    //         <div className="container table-dashboard">
    //             <table className="table table-hover table-bordered">
    //                 <thead>
    //                 <tr align="right">
    //                     <th colSpan={4}>
    //                         <div
    //                             className="btn-toolbar justify-content-between"
    //                             role="group"
    //                             aria-label="Players Manager"
    //                         >
    //                             <h4>Players</h4>
    //                             <div className="btn-group" role="group">
    //                                 <button
    //                                     type="button"
    //                                     className="btn btn-outline-primary"
    //                                     data-toggle="modal"
    //                                     data-target="#createNewPlayerModal"
    //                                 >
    //                                     New
    //                                 </button>
    //
    //                                 <CreatePlayer
    //                                     sectionid={props.location.state.section._id}
    //                                 />
    //
    //                                 <button
    //                                     type="button"
    //                                     className="btn btn-outline-primary"
    //                                     data-toggle="modal"
    //                                     data-target="#editPlayerModal"
    //                                 >
    //                                     Edit
    //                                 </button>
    //
    //                                 {checkData.checkedPlayers.length === 1 && (
    //                                     <EditPlayer
    //                                         editedplayer={props.players.players.find(
    //                                             o => o.playerid._id === checkData.checkedPlayers[0]
    //                                         )}
    //                                     />
    //                                 )}
    //
    //                                 <button
    //                                     type="button"
    //                                     className="btn btn-outline-primary"
    //                                     onClick={() => {
    //                                         props.deletePlayer(
    //                                             props.location.state.section._id,
    //                                             checkData
    //                                         );
    //                                         clearCheckData();
    //                                     }}
    //                                 >
    //                                     Delete
    //                                 </button>
    //                             </div>
    //                         </div>
    //                     </th>
    //                 </tr>
    //                 <tr>
    //                     <th scope="col"></th>
    //                     <th scope="col">Name</th>
    //                     <th scope="col">Rating</th>
    //                     <th scope="col">USCF ID</th>
    //                 </tr>
    //                 </thead>
    //
    //                 {props.players.players.loading && props.players.players === [] ? (
    //                     <Spinner/>
    //                 ) : (
    //                     <tbody>{players_list}</tbody>
    //                 )}
    //             </table>
    //         </div>
    //     </Fragment>
    // );
};

SectionDash.propTypes = {
    getCurrentPlayers: PropTypes.func.isRequired,
    deletePlayer: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    players: state.players
});

export default connect(mapStateToProps, {
    getCurrentPlayers,
    deletePlayer
})(SectionDash);
