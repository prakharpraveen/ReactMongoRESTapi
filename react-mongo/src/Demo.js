import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddDataDialog from './AddDataDialog';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  button: {
    margin: theme.spacing.unit,
  },

  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});


class Demo extends Component {

  state = {
    users: [],
    limitInterval: [5, 10, 20, 30, 50],
    limit: 10,
    skip: 0,
    count: 0,
    isAll: false,
    isAddData: false,
    search: ''
  };

  componentDidMount() { this.getUserData(); }


  getUserData = () => {
    const { limit, isAll, skip, search } = this.state;
    let url = 'http://localhost:7000/user?limit=' + limit + "&skip=" + skip + "&search=" + search;
    if (isAll) {
      url = 'http://localhost:7000/user';
    }
    axios.get(url)
      .then((response) => {
        console.log(response);
        this.setState({ users: response.data.docs, count: response.data.count, isAll: false })
      })
      .catch((error) => {
        console.log(error);
      });
  }
  setLlimit = (event) => {
    this.setState({ limit: event.target.value, skip: 0 }, () => this.getUserData());
  }

  getAllUsers = () => {
    this.setState({ isAll: true, limit: this.state.limit, skip: 0 }, () => this.getUserData());
  }
  getLimitedUsers = () => {
    this.setState({ isAll: false }, () => this.getUserData());
  }

  addDataHandler = () => {
    this.setState({ isAddData: true });
  }
  closeAddDataDialog = () => {
    this.setState({ isAddData: false });
  };

  next = () => {
    const { skip, limit, count } = this.state;
    let skip_data = skip + limit;

    if (skip_data <= count) {
      this.setState({ skip: skip + limit }, () => { this.getUserData() });
    }
  }

  previous = () => {
    const { skip, limit } = this.state;
    let skip_data = skip - limit;
    if (skip_data >= 0) {
      this.setState({ skip: skip_data }, () => { this.getUserData() });
    }
  }

  search = name => event => {
    const { limit } = this.state;
    this.setState({
      search: event.target.value,
      limit: limit,
      skip: 0,
      count: 0,

    }, () => this.getUserData());
  };
  render() {
    const { classes } = this.props;
    const { users = [], limit, isAddData, limitInterval, skip, count } = this.state;

    return <Grid container>
      <AddDataDialog isAddData={isAddData} closeAddDataDialog={this.closeAddDataDialog} getUserData={this.getUserData} />
      <Grid item xs={12} >
        <Button variant="contained" color="primary" className={classes.button} onClick={this.getAllUsers}>
          Get All users
        </Button>
        <Button variant="contained" color="primary" className={classes.button} onClick={this.addDataHandler}>
          Add data
        </Button>
        <Button variant="contained" color="secondary" className={classes.button} onClick={this.previous}>
          Previous
        </Button>
        <Button variant="contained" color="secondary" className={classes.button} onClick={this.next}>
          Next
        </Button>
        <Chip
          label={(skip === 0 ? "Page number "+  1 : "Page number " + ((skip / limit )+ 1)) + " of " + (Math.trunc((count / limit) +1)) + " & total " + count}
          className={classes.chip}
        />
      </Grid>
      <Grid item xs={1} />
      <Grid item xs={10}>

        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>

                </TableCell>
                <TableCell>
                  <TextField
                    id="outlined-name"
                    label="Search Name"
                    className={classes.textField}
                    value={this.state.name}
                    onChange={this.search()}
                    margin="normal"
                    variant="outlined"
                  /></TableCell>

                <TableCell>

                  <InputLabel htmlFor="limit-simple">Limit</InputLabel>
                  <Select
                    value={limit}
                    onChange={this.setLlimit}
                    inputProps={{
                      name: 'limit',
                      id: 'limit-simple',
                    }}
                  >
                    {
                      limitInterval.map(interval => (<MenuItem key={interval} value={interval}>{interval}</MenuItem>))
                    }
                  </Select>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableHead>
              <TableRow>
                <TableCell>Count</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((row, i) => {
                return <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {(skip === 0 ? i + 1 : skip + i + 1)}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.age}
                  </TableCell>
                </TableRow>;
              })}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
      <Grid item xs={1} />
    </Grid>;
  }
}

export default withStyles(styles)(Demo);