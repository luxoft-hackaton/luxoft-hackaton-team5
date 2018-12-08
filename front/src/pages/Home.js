import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

import Select from '../components/SelectDropDown';
import {getCoins} from '../provider/pair';
import { setToList, setFromList } from "../actions/index";


const styles = theme => ({
    root: {
        display:'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
    },
    title: {
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    bar:{
        alignItems: 'center',
        backgroundColor: '#6e8ec1',
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: '#8ca3ad',
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 3,
            width: 'auto',
        },
    },
    button: {
        margin: theme.spacing.unit,
        width: 200,
    },
    inputWrapper:{
        height: 600,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
    },

});

const mapStateToProps = state => {
    return {
        pairs: state.pairs,
        fromLIst: state.fromLIst,
        toList: state.toList,
    };

};
const mapDispatchToProps = dispatch => {
    return {
        setToList: coin => dispatch(setToList(coin)),
        setFromList: coin => dispatch(setFromList(coin)),
    };
};

class Home extends React.Component {
    async componentDidMount(){
        const result= await getCoins();
        console.log(result.data,' Pookish !!!!')
        this.props.setToList(result.data)
        this.props.setFromList(result.data)

    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <AppBar className={classes.bar} position="static">
                    <Toolbar>
                        <Typography className={classes.title} variant="h6" color="inherit" noWrap>
                            Make a best deal on market prices!
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Select />
            </div>
        );
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
    pairs: PropTypes.arrayOf(PropTypes.string),

};
Home.defaultProps = {
    // pairs :['BTC/XRP', 'BTC/USD', 'BTC/ETH', 'ETH/XRP', 'ETH/LTC', 'ETH/DAG', 'BTC/ZTH'],
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Home));
