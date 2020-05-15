import React, {Fragment} from "react";
import PropTypes from "prop-types";
import SectionDashNavbar from "../layout/SectionDashNavbar";
import {connect} from "react-redux";

const Standings = props => {
    return (
        <Fragment>
            <SectionDashNavbar currentsection={props.location.state.section}/>
            <div className="container table-dashboard">
                <table className="table table-hover table-bordered">
                    <thead>
                    <tr align="right">
                        <th colSpan={4}>
                            <div
                                className="btn-toolbar justify-content-between"
                                role="group"
                                aria-label="Sections Manager"
                            >
                                <h4>Standings</h4>
                            </div>
                        </th>
                    </tr>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">Name</th>
                        <th scope="col">Rating</th>
                        <th scope="col">USCF ID</th>
                    </tr>
                    </thead>
                </table>
            </div>
        </Fragment>
    );
};

Standings.propTypes = {};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, {})(Standings);
