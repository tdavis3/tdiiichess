import React, {Fragment, useEffect} from "react";
import PropTypes from "prop-types";
import SectionDashNavbar from "../layout/SectionDashNavbar";
import {connect} from "react-redux";
import {getResultPairings} from "../../actions/resultpairings";
import Spinner from "../layout/Spinner";

const ResultPairings = props => {
    useEffect(() => {
        props.getResultPairings(props.location.state.section._id, 1);
    }, []);

    const colorcalc = (
        color,
        playeronecolor,
        playeroneid,
        playertwocolor,
        playertwoid
    ) => {
        if (playeronecolor === color) {
            return playeroneid;
        } else {
            return playertwoid;
        }
    };
    const resultcalc = (whiteresult, blackresult) => {
        if (whiteresult === 0.5 && blackresult === 0.5) {
            return "Draw";
        }
        return whiteresult.toString().concat(" - ", blackresult.toString());
    };

    const resultpairings_list = props.resultpairings.resultpairings.map(
        (resultpairing, index) => (
            <tr key={resultpairing._id}>
                <td>
                    <div className="custom-control custom-checkbox">
                        <input
                            type="checkbox"
                            className="custom-control-input"
                            data-id={resultpairing._id}
                            id={"customCheck" + index.toString()}
                            // onChange={e => onChange(e)}
                        />
                        <label
                            className="custom-control-label"
                            htmlFor={"customCheck" + index.toString()}
                        >
                            {index + 1}
                        </label>
                    </div>
                </td>
                <td>{index + 1}</td>
                <td>
                    {colorcalc(
                        "W",
                        resultpairing.playeronecolor,
                        resultpairing.playeroneid,
                        resultpairing.playertwocolor,
                        resultpairing.playertwoid
                    )}
                </td>
                <td>
                    {resultcalc(
                        resultpairing.playeronecolor,
                        resultpairing.playertwocolor
                    )}
                </td>
                <td>
                    {colorcalc(
                        "B",
                        resultpairing.playeronecolor,
                        resultpairing.playeroneid,
                        resultpairing.playertwocolor,
                        resultpairing.playertwoid
                    )}
                </td>
            </tr>
        )
    );

    return (
        <Fragment>
            <SectionDashNavbar currentsection={props.location.state.section}/>
            <div className="container table-dashboard">
                <table className="table table-hover table-bordered">
                    <thead>
                    <tr align="right">
                        <th colSpan={5}>
                            <div
                                className="btn-toolbar justify-content-between"
                                role="group"
                                aria-label="Players Manager"
                            >
                                <h4>Pairings</h4>
                                <div className="btn-group" role="group">
                                    <button type="button" className="btn btn-outline-primary">
                                        Delete Pair
                                    </button>
                                </div>
                            </div>
                        </th>
                    </tr>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">Board</th>
                        <th scope="col">White</th>
                        <th scope="col">Result</th>
                        <th scope="col">Black</th>
                    </tr>
                    </thead>

                    {props.resultpairings.resultpairings.loading &&
                    props.resultpairings.resultpairings === [] ? (
                        <Spinner/>
                    ) : (
                        <tbody>{resultpairings_list}</tbody>
                    )}
                </table>
            </div>
        </Fragment>
    );
};

ResultPairings.propTypes = {
    getResultPairings: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    resultpairings: state.resultpairings
});

export default connect(mapStateToProps, {getResultPairings})(ResultPairings);
