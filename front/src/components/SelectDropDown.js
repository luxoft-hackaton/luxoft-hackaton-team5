import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MoneyIcon from '@material-ui/icons/AttachMoney';
import MoreIcon from '@material-ui/icons/MoreVert';
import {getAverage, getDetails} from '../provider/pair';
import {fade} from "@material-ui/core/styles/colorManipulator";
import { connect } from "react-redux";
import { setToList, setFrom, setTo, setAveragePrice, setResult } from "../actions/index";
import Table from "./Table";

const styles = theme => ({
    root: {
        display:'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: 120,
    },
    option:{
        font: 'caption',
    },
    label:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    inputWrapper:{
        height: 600,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'column',
    },
    dropWrapper:{
       flexDirection: 'row',
       display: 'flex',
       justifyContent: 'space-around',
       width: '100%',
       paddingTop: 50,
    },
    infoWrapper:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
    }
});

const mapStateToProps = state => {
    return { pairs: state.pairs,
        toList:state.toList,
        fromList:state.fromList,
        result:state.result,
        from:state.from,
        to:state.to,
        averagePrice:state.averagePrice,
    };
};
const mapDispatchToProps = dispatch => {
    return {
        setResult: result => dispatch(setResult(result)),
        setAveragePrice: averagePrice => dispatch(setAveragePrice(averagePrice)),
        setToList: toList => dispatch(setToList(toList)),
        setTo: to => dispatch(setTo(to)),
        setFrom: from => dispatch(setFrom(from)),
    };
};

class SelectDropDown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            check: false
        };
    }

    handleFromChange = () => event => {
        this.props.setFrom(event.target.value);
    };
    handleChange = () => event => {
        this.props.setTo(event.target.value);
    };
    onGetPrice = async ()=> {
        const result=await getAverage(this.props.from, this.props.to);
        this.props.setAveragePrice(result.data);
    };
    onMoreClick = async ()=> {
        const result=await getDetails(this.props.from, this.props.to);
        this.props.setResult(result.data);
        this.setState({check:!this.state.check})

    };

    render() {
        const {classes,toList, fromList, from, to, averagePrice} =this.props;
        return (
            <div className={classes.root}>
                <div className={classes.inputWrapper}>
                    <div className={classes.dropWrapper}>
                        <div className={classes.main}>
                            <div className={classes.label}>
                                <InputLabel htmlFor="age-native-simple" >From</InputLabel>
                                <MoneyIcon/>
                            </div>
                            <Select
                                value={from}
                                onChange={this.handleFromChange()}
                                inputProps={{
                                    name: 'coin',
                                    id: 'age-native-simple',
                                }}
                            >
                                {fromList.map((option, index) => <option key={`${index}-pookish`} className={classes.option} value={option}>{option}</option>)}
                            </Select>
                        </div>
                        <div className={classes.main}>
                            <div className={classes.label}>
                                <InputLabel htmlFor="age-native-simple" >To</InputLabel>
                                <MoneyIcon/>
                            </div>
                            <Select
                                value={to}
                                onChange={this.handleChange()}
                                inputProps={{
                                    name: 'coin',
                                    id: 'age-native-simple',
                                }}
                            >
                                {toList.map((option, index)=> <option key={`${index}-pookish`} className={classes.option} value={option}>{option}</option>)}
                            </Select>
                        </div>
                    </div>
                    {averagePrice.pair?<div className={classes.infoWrapper}>
                        <span>{`Pair:   ${averagePrice.pair}`}</span>
                        <span>{`Price:  ${averagePrice.price}`}</span>
                        <span>{`Timestamp:   ${averagePrice.timestamp}`}</span>
                        <IconButton onClick={this.onMoreClick}>
                            <MoreIcon/>
                        </IconButton>
                    </div>:<div>Choose needed pair to get price!</div>}
                    {this.state.check?<Table/>:null}
                </div>
                <Button variant="outlined"
                        color="primary"
                        disabled={to ===''}
                        onClick={this.onGetPrice}
                        className={classes.button}>
                    GET PRICE
                </Button>
            </div>

        );
    }
}

SelectDropDown.propTypes = {
    toList: PropTypes.arrayOf(PropTypes.string),
    fromList: PropTypes.arrayOf(PropTypes.string),
    classes: PropTypes.object.isRequired,
    pairs: PropTypes.arrayOf(PropTypes.string),
};
SelectDropDown.defaultProps = {
    // fromList :[''],
    // toLIst :[''],
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SelectDropDown));
