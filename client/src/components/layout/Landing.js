import React from "react";

import {makeStyles} from '@material-ui/core/styles';
import {Button, Container, Grid} from '@material-ui/core';

const useStyles = makeStyles({
    auth: {
        margin: '20px'
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
});

const Landing = () => {
    const classes = useStyles();

    return (
        <div>
            <div className="jumbotron text-center">
                <div className="container">
                    <h1 className="jumbotron-heading">Chess Tournament Software</h1>
                    <p className="lead text-muted">
                        A new, powerful, and lightweight chess tournament management & pairing software.
                        It seeks to make any tournament director's job super easy.
                    </p>
                    <p>
                        <Button className={classes.auth} variant={'outlined'} size={'large'} href={'/register'}>
                            Register
                        </Button>
                        <Button className={classes.auth} variant={'outlined'} size={'large'} href={'/login'}>
                            Login
                        </Button>
                    </p>
                </div>
            </div>

            <Container>
                <Grid container spacing={5}>
                    <Grid xs={12} sm={6} md={4}>
                        <div className={classes.card}>
                            <h2>Functionality</h2>
                            <p>
                                Currently, we support unrated and USCF rated tournaments.
                                Directors can manage their tournaments, sections, and players in
                                an interactive environment. We support only the most necessary
                                features to maintain usability.
                            </p>
                        </div>
                    </Grid>
                    <Grid xs={12} sm={6} md={4}>
                        <div className={classes.card}>
                            <h2>Design</h2>
                            <p>
                                Most of the current chess pairing software is old, difficult to
                                manage, and frankly unappealing. The learning curve for those
                                technologies is too high for commonplace tournament directors.
                                TDIII Chess is simple and visually appealing allowing for a quick
                                entry.
                            </p>
                        </div>
                    </Grid>
                    <Grid xs={12} sm={6} md={4}>
                        <div className={classes.card}>
                            <h2>Coming Soon!</h2>
                            <p>
                                In the future, we plan on supporting FIDE rated tournaments and
                                other national federations. In addition, to team tournaments.
                            </p>
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default Landing;
