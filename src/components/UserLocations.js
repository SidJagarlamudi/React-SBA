import React, { Component } from "react";
import { connect } from "react-redux";
import { deleteLocationSuccess } from "../actions/location";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import RoomIcon from "@material-ui/icons/Room";

export class UserLocations extends Component {
  state = {
    usersLocations: false,
  };

  componentDidMount() {
    if (this.props.auth !== null || undefined) {
      fetch("https://myclimate.herokuapp.com/locations")
        .then((resp) => resp.json())
        .then((locations) => {
          console.log(this.props);
          console.log(this.state);
          const myLocations = locations.filter(
            (loc) => loc.user_id === this.props.auth.id
          );
          console.log(myLocations);
          this.setState({ usersLocations: myLocations });
        });
    }
  }

  handleDelete = (id) => {
    console.log("i was clicked!");
    const reqObj = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(`https://myclimate.herokuapp.com/locations/${id}`, reqObj)
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        this.props.deleteLocationSuccess(id);
        this.setState({
          usersLocations: this.state.usersLocations.filter(
            (loc) => loc.id !== data.id
          ),
        });
      });
  };

  render() {
    console.log(this.props);
    if (this.props.auth === null) {
      return (
        <div>
          <h4>You must be logged in to save locations.</h4>
        </div>
      );
    } else if (this.state.usersLocations === false) {
      return (
        <div>
          <h4>You have no saved locations.</h4>
        </div>
      );
    } else {
      return this.state.usersLocations.map((location) => {
        return (
          <div className="location-card">
            <Card className={"hovered-location"} variant="outlined">
              <CardContent>
                <div class="loc-card-name">
                  <span style={{ "font-size": "18px" }}>{location.name}</span>
                </div>
                <div class="loc-icons">
                  <IconButton
                    className={"delete-btn"}
                    onClick={() => this.handleDelete(location.id)}
                    color="white"
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    className={"go-btn"}
                    onClick={() => this.props.clicked(location)}
                    color="white"
                    aria-label="delete"
                  >
                    <RoomIcon />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      });
    }
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = {
  deleteLocationSuccess,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserLocations);
