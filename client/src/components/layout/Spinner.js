import React, { Fragment } from "react";
import CircularProgress from '@material-ui/core/CircularProgress';

export default () => (
  <Fragment>
    {/*<div className="spinner-border spinner-border-sm" role="status">*/}
    {/*  <span className="sr-only">Loading...</span>*/}
    {/*</div>*/}
      <CircularProgress />
  </Fragment>
);
