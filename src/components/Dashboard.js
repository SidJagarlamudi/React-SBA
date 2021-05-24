import React from "react";
import { connect } from "react-redux";
import { fetchLocationsSuccess } from "../actions/location";
import { fetchStatSuccess } from "../actions/stat";
import { fetchCitiesSuccess } from "../actions/city";
import { currentUser } from "../actions/auth";
import ClimateMap from "./ClimateMap";
import climScores from "./climScores.json";

class Dashboard extends React.Component {
  state = {
    climateScores: climScores,
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    const reqObj = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (token) {
      fetch("https://myclimate.herokuapp.com/current_user", reqObj)
        .then((resp) => resp.json())
        .then((data) => {
          this.props.currentUser(data);
        });
    }
    fetch(
      "https://api.waqi.info/map/bounds/?latlng=85,-180,-85.05115,180&token=87b2bba6a5b2e26c577ffc48e297eaed82a8408c"
    )
      .then((resp) => resp.json())
      .then((stations) => {
        let y = stations.data;
        let x = stations.data.slice(0, 4500);
        this.props.fetchStatSuccess(y);
      });
  }

  render() {
    if (this.props.stats.length !== 0) {
      return (
        <div>
          <ClimateMap
            cities={this.props.cities}
            climateScores={this.state.climateScores}
          />
        </div>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    current_user: state.currentUser,
    locations: state.locations,
    stats: state.stats,
    cities: state.cities,
  };
};

const mapDispatchToProps = {
  fetchLocationsSuccess,
  fetchStatSuccess,
  fetchCitiesSuccess,
  currentUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
