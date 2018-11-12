import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
});
class AddDataDialog extends React.Component {
  state = {
    open: false,
    age: '',
    name: ''
  };

  handleClickOpen = () => {
    this.setState({
      open: false,
      age: '',
      name: ''
    });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  addData = (isClose) => {
    const { age, name } = this.state;
    const { closeAddDataDialog, getUserData } = this.props;
    let url = 'http://localhost:7000/user';
    axios.post(url, { age, name })
      .then((response) => {
        this.setState({
          open: false,
          age: '',
          name: ''
        });
        getUserData();
        if (isClose) {
          closeAddDataDialog();
        }
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { classes, isAddData, closeAddDataDialog } = this.props;
    const { age, name } = this.state;
    return (
      <div>
        <Dialog
          open={isAddData}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Add Data</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <TextField
                id="standard-name"
                label="Name"
                className={classes.textField}
                value={this.state.name}
                onChange={this.handleChange('name')}
                margin="normal"
              />
              <TextField
                id="standard-age"
                label="age"
                className={classes.textField}
                value={this.state.age}
                onChange={this.handleChange('age')}
                margin="normal"
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => closeAddDataDialog()} color="primary">
              Close
            </Button>
            <Button onClick={() => this.addData(false)} color="primary" autoFocus>
              Add
            </Button>
            <Button onClick={() => this.addData(true)} color="primary" autoFocus>
              {"Add & close"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(AddDataDialog)
