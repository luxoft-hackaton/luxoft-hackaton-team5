import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const styles = theme => ({
    root: {
        width: '70%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
});


const mapStateToProps = state => {
    return { result: state.result};
};


const  SimpleTable=(props) => {
    const { classes, result } = props;

    return (
        <Paper className={classes.root}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>exchange</TableCell>
                        <TableCell >price</TableCell>
                        <TableCell >amount</TableCell>
                        <TableCell>timestamp</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {result.map((row, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell >{row.exchange}</TableCell>
                                <TableCell >{row.price}</TableCell>
                                <TableCell >{row.amount}</TableCell>
                                <TableCell >{row.timestamp}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Paper>
    );
}

SimpleTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(SimpleTable));
