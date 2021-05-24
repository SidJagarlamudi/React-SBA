import React, { Component } from "react";
import { GoogleApiWrapper, Map, Marker, InfoWindow } from "google-maps-react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import "react-google-places-autocomplete/dist/index.min.css";
import Geocode from "react-geocode";
import Grid from "@material-ui/core/Grid";
import { Dropdown } from "semantic-ui-react";
import mapStyles from "./mapStyles";
import Markers from "./Markers";
import { Line, Doughnut } from "react-chartjs-2";
import UserLocations from "./UserLocations";
import { createLocationSuccess } from "../actions/location";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import IconButton from "@material-ui/core/IconButton";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import aqiTable from "../images/aqiTable.png";

export class ClimateMap extends Component {
  constructor() {
    super();
    this.timer = null;
  }
  state = {
    searchText: "",
    showClimateScore: false,
    coords: {
      lat: -23.304354,
      lng: 151.916417,
    },
    address: "Wilson Island, Australia",
    allScores: false,
    showAQI: true,
    hoveredPinStat: {},
    hoveredCoords: {
      lat: "",
      lng: "",
    },
    activeMarker: {},
    activeCSMarker: false,
    data: false,
    markersRendered: false,
    showUserLocations: false,
    hovered: false,
    myLocations: [],
    saveDisabled: false,
    modalOpen: "none",
    mapStyle: null,
  };

  // mouseEnterHandler = (marker, e) => {
  //   this.setState({ hovered: true, activeMarker: marker });
  // };

  // mouseLeaveHandler = () => {
  //   this.setState({ hovered: false });
  // };

  onMarkerDragEnd = (coord) => {
    const { latLng } = coord;
    const newLat = latLng.lat();
    const newLon = latLng.lng();
    this._score.state.coords.lat = newLat;
    this._score.state.coords.lng = newLon;
    this._map.map.setCenter({ lat: newLat, lng: newLon });
    Geocode.setApiKey("AIzaSyDmc1KD6Xr80d3hduc4Q2MObw1uotQuY-8");
    Geocode.fromLatLng(newLat, newLon).then(
      (response) => {
        const newAddress = response.results[0].formatted_address;
        this._score.state.address = newAddress;
      },
      (error) => {
        console.error(error);
      }
    );
    fetch(
      `https://api.waqi.info/feed/geo:${newLat};${newLon}/?token=87b2bba6a5b2e26c577ffc48e297eaed82a8408c`
    )
      .then((resp) => resp.json())
      .then((data) => {
        this._score.state.aqi = data.data.aqi;
      });
  };

  handleSubmit = (value) => {
    Geocode.setApiKey("AIzaSyDmc1KD6Xr80d3hduc4Q2MObw1uotQuY-8");
    Geocode.fromAddress(`${value.description}`).then((response) => {
      const { lat, lng } = response.results[0].geometry.location;
      this.setState({
        coords: {
          lat: lat,
          lng: lng,
        },
      });
      this._map.map.setCenter({ lat: lat, lng: lng });
      this._search.clearValue();
      fetch(`https://climate-score.p.rapidapi.com/${lat}/${lng}`, {
        method: "GET",
        headers: {
          "x-rapidapi-host": "climate-score.p.rapidapi.com",
          "x-rapidapi-key":
            "c5855f8358mshe884588b34ae70ep1a1627jsn5e1e97c23a80",
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          this.setState({
            allScores: {
              ClimateScore: data.ClimateScore,
              DroughtScore: data.DroughtScore,
              FireScore: data.FireScore,
              SeaLevelScore: data.SeaLevelScore,
              StormScore: data.StormScore,
              TempScore: data.TempScore,
            },
          });
        })
        .catch((err) => {
          this.setState({
            allScores: false,
          });
        });
      Geocode.fromLatLng(lat, lng).then(
        (response) => {},
        (error) => {
          console.error(error);
        }
      );
      fetch(
        `https://api.waqi.info/feed/geo:${lat};${lng}/?token=87b2bba6a5b2e26c577ffc48e297eaed82a8408c`
      )
        .then((resp) => resp.json())
        .then((locationData) => {
          this.setState({
            data: locationData.data,
          });
        });
    });
  };

  showClimateScore = (marker) => {
    const newLat = marker.position.lat;
    const newLon = marker.position.lng;
    Geocode.setApiKey("AIzaSyDmc1KD6Xr80d3hduc4Q2MObw1uotQuY-8");
    Geocode.fromLatLng(newLat, newLon).then((response) => {
      const newAddress = response.results[0].formatted_address;
      this.setState({
        address: newAddress,
        activeCSMarker: marker,
      });
    });
  };

  renderClimateScores = () => {
    return this.props.climateScores.map((score) => {
      const numberString = score.ClimateScore.toString();
      const google = this.props.google;
      let iw = 83,
        ih = 107;
      return (
        <Marker
          score={score}
          onClick={this.showClimateScore}
          position={{ lat: score.lat, lng: score.lng }}
          icon={{
            url: `https://waqi.info/mapicon/${numberString}.50.png`,
            anchor: new google.maps.Point(iw / 4, ih / 2 - 5),
            size: new google.maps.Size(iw / 2, ih / 2),
            scaledSize: new google.maps.Size(30, 40),
          }}
        />
      );
    });
  };

  labelClicked = (e) => {
    if (e.nativeEvent.target.innerHTML === "Climate Score™") {
      this.setState({
        showAQI: false,
      });
    } else {
      this.setState({
        showAQI: true,
        activeCSMarker: false,
      });
    }
  };

  onMarkerClick = (marker, e) => {
    fetch(
      `https://api.waqi.info/feed/geo:${marker.info.lat};${marker.info.lon}/?token=87b2bba6a5b2e26c577ffc48e297eaed82a8408c`
    )
      .then((resp) => resp.json())
      .then((data) => {
        if (this.state.showUserLocations) {
          this.setState({
            data: data.data,
            showUserLocations: false,
          });
        } else {
          this.setState({
            data: data.data,
          });
        }
      });
  };

  onMarkerHover = (props, marker, e) => {
    this.setState({
      activeMarker: marker,
      showInfo: true,
    });
  };

  addLocation = () => {
    if (this.props.auth === null || undefined){
      alert('You must be logged in to use this feature.')
    } else if (this.state.data !== false) {
      const newLocation = {
        name: this.state.data.city.name,
        user_id: this.props.auth.id,
        lat: this.state.data.city.geo[0],
        lng: this.state.data.city.geo[1],
      };
      const reqObj = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLocation),
      };
      fetch("https://myclimate.herokuapp.com/locations", reqObj)
        .then((resp) => resp.json())
        .then((newLocation) => {
          this.props.createLocationSuccess(newLocation);
        });
    }
  };

  goToLocation = (location) => {
    this._map.map.setCenter({ lat: location.lat, lng: location.lng });
    fetch(
      `https://api.waqi.info/feed/geo:${location.lat};${location.lng}/?token=87b2bba6a5b2e26c577ffc48e297eaed82a8408c`
    )
      .then((resp) => resp.json())
      .then((data) => {
        this.setState({
          data: data.data,
          showUserLocations: false,
        });
      });
  };

  showMyList = () => {
    this.setState({
      showUserLocations: true,
    });
  };

  showStats = () => {
    this.setState({
      showUserLocations: false,
    });
  };

  openModal = () => {
    this.setState({
      modalOpen: "block",
    });
  };

  handleModalClose = () => {
    this.setState({
      modalOpen: "none",
    });
  };

  render() {
    const searchLat = localStorage.getItem("searchLat");
    const searchLng = localStorage.getItem("searchLng");
    let searchCoords
    if (searchLat){
      searchCoords = {lat: parseFloat(searchLat),lng: parseFloat(searchLng)}
    } else {
      searchCoords = this.state.coords
    }
    let aqiColor;
    if (this.state.data !== false && this.state.data.aqi <= 50) {
      aqiColor = "#c1ff7a";
    } else if (this.state.data !== false && this.state.data.aqi <= 100) {
      aqiColor = "#ffff33";
    } else if (this.state.data !== false && this.state.data.aqi <= 150) {
      aqiColor = "#ffc570";
    } else if (this.state.data !== false && this.state.data.aqi <= 200) {
      aqiColor = "#f6685e";
    } else if (this.state.data !== false && this.state.data.aqi <= 300) {
      aqiColor = "#ea80fc";
    } else {
      aqiColor = "#b2b9e1";
    }
    let climColor;
    if (
      this.state.activeCSMarker !== false &&
      this.state.activeCSMarker.score.ClimateScore <= 25
    ) {
      climColor = "#c1ff7a";
    } else if (
      this.state.activeCSMarker !== false &&
      this.state.activeCSMarker.score.ClimateScore <= 50
    ) {
      climColor = "#ffff33";
    } else {
      climColor = "#ffc570";
    }
    let o3Data;
    let uviData;
    let pm10Data;
    let pm25Data;
    let days;
    let hours;
    let minutes;
    let droughtData;
    let fireData;
    let seaData;
    let stormData;
    let tempData;
    if (this.state.activeCSMarker) {
      droughtData = {
        datasets: [
          {
            data: [
              this.state.activeCSMarker.score.DroughtScore,
              100 - this.state.activeCSMarker.score.DroughtScore,
            ],
            backgroundColor: ["#FF6384", "#36A2EB"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB"],
          },
        ],
      };
      fireData = {
        datasets: [
          {
            data: [
              this.state.activeCSMarker.score.FireScore,
              100 - this.state.activeCSMarker.score.FireScore,
            ],
            backgroundColor: ["#FF6384", "#36A2EB"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB"],
          },
        ],
      };
      seaData = {
        datasets: [
          {
            data: [
              this.state.activeCSMarker.score.SeaLevelScore,
              100 - this.state.activeCSMarker.score.SeaLevelScore,
            ],
            backgroundColor: ["#FF6384", "#36A2EB"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB"],
          },
        ],
      };
      stormData = {
        datasets: [
          {
            data: [
              this.state.activeCSMarker.score.StormScore,
              100 - this.state.activeCSMarker.score.StormScore,
            ],
            backgroundColor: ["#FF6384", "#36A2EB"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB"],
          },
        ],
      };
      tempData = {
        datasets: [
          {
            data: [
              this.state.activeCSMarker.score.TempScore,
              100 - this.state.activeCSMarker.score.TempScore,
            ],
            backgroundColor: ["#FF6384", "#36A2EB"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB"],
          },
        ],
      };
    }
    if (this.state.data !== false) {
      let now = new Date().getTime();
      let newDate = new Date(this.state.data.time.iso).getTime();
      let distance = newDate - now;
      days = Math.floor(distance / (1000 * 60 * 60 * 24));
      hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      if (
        this.state.data.forecast.daily !== undefined &&
        "o3" in this.state.data.forecast.daily
      ) {
        let labelArr = [],
          avgArr = [],
          minArr = [],
          maxArr = [];
        for (let i = 0; i < this.state.data.forecast.daily.o3.length; i++) {
          labelArr.push(
            new Date(this.state.data.forecast.daily.o3[i].day)
              .toString()
              .substring(0, 10)
          );
          avgArr.push(this.state.data.forecast.daily.o3[i].avg);
          minArr.push(this.state.data.forecast.daily.o3[i].min);
          maxArr.push(this.state.data.forecast.daily.o3[i].max);
        }
        o3Data = {
          labels: labelArr,
          datasets: [
            {
              label: "max",
              backgroundColor: "#f7ff66",
              borderColor: "#f7ff66",
              borderWidth: 0,
              data: maxArr,
              fill: "1",
              radius: 1,
            },
            {
              label: "avg",
              backgroundColor: "#4a9eff",
              borderColor: "#4a9eff",
              borderWidth: 1,
              data: avgArr,
              fill: "-1",
              line: false,
              radius: 5,
            },
            {
              label: "min",
              backgroundColor: "#87ff9f",
              borderColor: "#87ff9f",
              borderWidth: 0,
              data: minArr,
              line: false,
              fill: "1",
              radius: 1,
            },
          ],
        };
      }
      if (
        this.state.data.forecast.daily !== undefined &&
        "pm10" in this.state.data.forecast.daily
      ) {
        let labelArr = [],
          avgArr = [],
          minArr = [],
          maxArr = [];
        for (let i = 0; i < this.state.data.forecast.daily.pm10.length; i++) {
          labelArr.push(
            new Date(this.state.data.forecast.daily.pm10[i].day)
              .toString()
              .substring(0, 10)
          );
          avgArr.push(this.state.data.forecast.daily.pm10[i].avg);
          minArr.push(this.state.data.forecast.daily.pm10[i].min);
          maxArr.push(this.state.data.forecast.daily.pm10[i].max);
        }
        pm10Data = {
          labels: labelArr,
          datasets: [
            {
              label: "max",
              backgroundColor: "#f7ff66",
              borderColor: "#f7ff66",
              borderWidth: 0,
              data: maxArr,
              fill: "1",
              radius: 1,
            },
            {
              label: "avg",
              backgroundColor: "#4a9eff",
              borderColor: "#4a9eff",
              borderWidth: 1,
              data: avgArr,
              fill: "-1",
              line: false,
              radius: 5,
            },
            {
              label: "min",
              backgroundColor: "#87ff9f",
              borderColor: "#87ff9f",
              borderWidth: 0,
              data: minArr,
              line: false,
              fill: "1",
              radius: 1,
            },
          ],
        };
      }
      if (
        this.state.data.forecast.daily !== undefined &&
        "pm25" in this.state.data.forecast.daily
      ) {
        let labelArr = [],
          avgArr = [],
          minArr = [],
          maxArr = [];
        for (let i = 0; i < this.state.data.forecast.daily.pm25.length; i++) {
          labelArr.push(
            new Date(this.state.data.forecast.daily.pm25[i].day)
              .toString()
              .substring(0, 10)
          );
          avgArr.push(this.state.data.forecast.daily.pm25[i].avg);
          minArr.push(this.state.data.forecast.daily.pm25[i].min);
          maxArr.push(this.state.data.forecast.daily.pm25[i].max);
        }
        pm25Data = {
          labels: labelArr,
          datasets: [
            {
              label: "max",
              backgroundColor: "#f7ff66",
              borderColor: "#f7ff66",
              borderWidth: 0,
              data: maxArr,
              fill: "1",
              radius: 1,
            },
            {
              label: "avg",
              backgroundColor: "#4a9eff",
              borderColor: "#4a9eff",
              borderWidth: 1,
              data: avgArr,
              fill: "-1",
              line: false,
              radius: 5,
            },
            {
              label: "min",
              backgroundColor: "#87ff9f",
              borderColor: "#87ff9f",
              borderWidth: 0,
              data: minArr,
              line: false,
              fill: "1",
              radius: 1,
            },
          ],
        };
      }
      if (
        this.state.data.forecast.daily !== undefined &&
        "uvi" in this.state.data.forecast.daily
      ) {
        let labelArr = [],
          avgArr = [],
          minArr = [],
          maxArr = [];
        for (let i = 0; i < this.state.data.forecast.daily.uvi.length; i++) {
          labelArr.push(
            new Date(this.state.data.forecast.daily.uvi[i].day)
              .toString()
              .substring(0, 10)
          );
          avgArr.push(this.state.data.forecast.daily.uvi[i].avg);
          minArr.push(this.state.data.forecast.daily.uvi[i].min);
          maxArr.push(this.state.data.forecast.daily.uvi[i].max);
        }
        uviData = {
          labels: labelArr,
          datasets: [
            {
              label: "max",
              backgroundColor: "#f7ff66",
              borderColor: "#f7ff66",
              borderWidth: 0,
              data: maxArr,
              fill: "1",
              radius: 1,
            },
            {
              label: "avg",
              backgroundColor: "#4a9eff",
              borderColor: "#4a9eff",
              borderWidth: 1,
              data: avgArr,
              fill: "-1",
              line: false,
              radius: 5,
            },
            {
              label: "min",
              backgroundColor: "#87ff9f",
              borderColor: "#87ff9f",
              borderWidth: 0,
              data: minArr,
              line: false,
              fill: "1",
              radius: 1,
            },
          ],
        };
      }
    }
    const mapOptions = [
      {
        key: "Climate Score",
        text: "Climate Score™",
        value: "Climate Score",
      },
      {
        key: "Air Quality Index",
        text: "Air Quality Index",
        value: "Air Quality Index",
      },
    ];
    const darkTheme = createMuiTheme({
      palette: {
        type: "dark",
      },
    });
    let saveDisabled;
    if (
      this.state.data !== false &&
      this.props.locations !== [] &&
      this.props.locations.some((loc) => loc.name === this.state.data.city.name)
    ) {
      saveDisabled = true;
    } else {
      saveDisabled = false;
    }
    let showAqiTable = this.state.modalOpen;
    return (
      <ThemeProvider theme={darkTheme}>
        <div className="nav">
          <img
            id="aqiTable"
            src={aqiTable}
            alt="aqiTable"
            style={{ display: showAqiTable }}
          ></img>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
            container
            spacing={0}
          >
            <div className="search">
              <GooglePlacesAutocomplete
                ref={(search) => (this._search = search)}
                onSelect={this.handleSubmit}
                inputStyle={{
                  background: "rgba(0, 0, 0, 0.3)",
                  color: "#FFFFFF",
                  "border-radius": "1px",
                }}
                placeholder="🔎 Search"
                suggestionsStyles={{
                  background: "none",
                  "border-radius": "1px",
                }}
              />
            </div>
            <Grid item xs={8}>
              <div className="location">
                <Map
                  ref={(map) => (this._map = map)}
                  google={this.props.google}
                  styles={this.state.mapStyle}
                  disableDefaultUI={true}
                  streetViewControl={true}
                  zoomControl={true}
                  mapTypeControl={true}
                  mapTypeControlOptions={{
                    position: this.props.google.maps.ControlPosition.TOP_CENTER,
                  }}
                  zoomControlOptions={{
                    style: this.props.google.maps.ZoomControlStyle.DEFAUL,
                    position: this.props.google.maps.ControlPosition
                      .LEFT_CENTER,
                  }}
                  streetViewControlOptions={{
                    position: this.props.google.maps.ControlPosition
                      .LEFT_CENTER,
                  }}
                  initialCenter={searchCoords}
                  center={this.state.coords}
                  zoom={8}
                >
                  <div className="filter">
                    <Dropdown
                      closeOnChange
                      inline
                      options={mapOptions}
                      onChange={this.labelClicked}
                      defaultValue={mapOptions[1].value}
                    />
                  </div>
                  {this.state.showAQI ? (
                    <Markers
                      onClick={this.onMarkerClick}
                      onMouseover={this.mouseEnterHandler}
                      onMouseout={this.mouseLeaveHandler}
                    />
                  ) : null}
                  {!this.state.showAQI ? this.renderClimateScores() : null}
                </Map>
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="hello">
                {this.state.activeCSMarker ? (
                  <Card
                    variant="outlined"
                    className={'detail-card'}
                    style={{ overflow: "auto" }}
                  >
                    <CardContent>
                      <Typography
                        variant="h4"
                        component="h2"
                        style={{ color: climColor }}
                      >
                        {this.state.activeCSMarker !== false
                          ? "Climate Score: " +
                            this.state.activeCSMarker.score.ClimateScore
                          : null}
                      </Typography>
                      <Typography variant="h5" component="h2">
                        {this.state.activeCSMarker !== false
                          ? this.state.address
                          : null}
                      </Typography>
                      <div class="clim-score">
                        <h1>{this.state.activeCSMarker.score.DroughtScore}</h1>
                      </div>
                      <Doughnut
                        data={droughtData}
                        options={{
                          responsive: true,
                          title: {
                            display: true,
                            text: "Drought Score",
                            fontSize: 18,
                            fontColor: "#FFFFFF",
                          },
                          legend: {
                            display: false,
                          },
                        }}
                      />
                      <div class="clim-score">
                        <h1>{this.state.activeCSMarker.score.StormScore}</h1>
                      </div>
                      <Doughnut
                        data={stormData}
                        options={{
                          responsive: true,
                          title: {
                            display: true,
                            text: "Storm Score",
                            fontSize: 18,
                            fontColor: "#FFFFFF",
                          },
                          legend: {
                            display: false,
                          },
                        }}
                      />
                      <div class="clim-score">
                        <h1>{this.state.activeCSMarker.score.TempScore}</h1>
                      </div>
                      <Doughnut
                        data={tempData}
                        options={{
                          responsive: true,
                          title: {
                            display: true,
                            text: "Temperature Score",
                            fontSize: 18,
                            fontColor: "#FFFFFF",
                          },
                          legend: {
                            display: false,
                          },
                        }}
                      />
                      <div class="clim-score">
                        <h1>{this.state.activeCSMarker.score.FireScore}</h1>
                      </div>
                      <Doughnut
                        data={fireData}
                        options={{
                          responsive: true,
                          title: {
                            display: true,
                            text: "Fire Score",
                            fontSize: 18,
                            fontColor: "#FFFFFF",
                          },
                          legend: {
                            display: false,
                          },
                        }}
                      />
                      <div class="clim-score">
                        <h1>{this.state.activeCSMarker.score.SeaLevelScore}</h1>
                      </div>
                      <Doughnut
                        data={seaData}
                        options={{
                          responsive: true,
                          title: {
                            display: true,
                            text: "Sea Level Score",
                            fontSize: 18,
                            fontColor: "#FFFFFF",
                          },
                          legend: {
                            display: false,
                          },
                        }}
                      />
                    </CardContent>
                  </Card>
                ) : null}
                {!this.state.showUserLocations && this.state.showAQI ? (
                  <Card
                    className={'detail-card'}
                    variant="outlined"
                    style={{ overflow: "auto" }}
                  >
                    <CardContent>
                      <div className="next2">
                        <IconButton
                          className={"go-and-back"}
                          onClick={this.showMyList}
                          color="white"
                        >
                          <ArrowForwardIosIcon />
                        </IconButton>
                      </div>
                      <Typography
                        variant="h5"
                        component="h2"
                        style={{ color: aqiColor }}
                      >
                        {this.state.data !== false
                          ? "Air Quality Index: " + this.state.data.aqi
                          : null}
                        {this.state.data !== false ? (
                          <span>
                            {" "}
                            <IconButton
                              className={"help-icon"}
                              onMouseOver={() => this.openModal()}
                              onMouseOut={() => this.handleModalClose()}
                              color="white"
                            >
                              <HelpOutlineIcon
                                style={{ color: "rgba(255, 255, 255, 0.5)" }}
                              />
                            </IconButton>
                          </span>
                        ) : null}
                      </Typography>
                      <Typography variant="h4" component="h2">
                        {this.state.data !== false
                          ? this.state.data.city.name
                          : null}
                      </Typography>
                      <Typography color="textSecondary">
                        {this.state.data !== false
                          ? +"" +
                            -hours +
                            " hrs & " +
                            -minutes +
                            " mins ago - " +
                            this.state.data.time.s
                          : null}
                      </Typography>
                      <Typography color="textSecondary">
                        {this.state.data !== false
                          ? <div><span style={{color: 'white', fontSize: 16}}>Daily Air Pollution Forecast </span>-<span style={{color: '#f7ff66', fontSize: 16}}>  Max </span>|<span style={{color: '#4a9eff', fontSize: 16}}> Avg </span>|<span style={{color: '#87ff9f', fontSize: 16}}> Min</span></div>
                          : null}
                      </Typography>
                      {this.state.data !== false &&
                      this.state.data.forecast.daily !== undefined ? (
                        <div>
                          <Line
                            data={o3Data}
                            options={{
                              responsive: true,
                              scales: {
                                yAxes: [
                                  {
                                    ticks: {
                                      beginAtZero: true,
                                      fontColor: "white",
                                    },
                                  },
                                ],
                                xAxes: [
                                  {
                                    ticks: {
                                      beginAtZero: true,
                                      fontColor: "white",
                                    },
                                  },
                                ],
                              },
                              tooltips: {
                                mode: "index",
                                intersect: true,
                                callbacks: {
                                  label: function (tooltipItem) {
                                    return (
                                      Number(tooltipItem.yLabel) + " µg/m³"
                                    );
                                  },
                                },
                                displayColors: true,
                              },
                              title: {
                                display: true,
                                text: "Ozone (O3) Forecast",
                                fontSize: 12,
                                fontColor: "#FFFFFF",
                              },
                              legend: {
                                display: false,
                              },
                            }}
                          />
                          <Line
                            data={pm10Data}
                            options={{
                              responsive: true,
                              scales: {
                                yAxes: [
                                  {
                                    ticks: {
                                      beginAtZero: true,
                                      fontColor: "white",
                                    },
                                  },
                                ],
                                xAxes: [
                                  {
                                    ticks: {
                                      beginAtZero: true,
                                      fontColor: "white",
                                    },
                                  },
                                ],
                              },
                              tooltips: {
                                mode: "index",
                                intersect: false,
                                callbacks: {
                                  label: function (tooltipItem) {
                                    return (
                                      Number(tooltipItem.yLabel) + " µg/m³"
                                    );
                                  },
                                },
                                displayColors: true,
                              },
                              title: {
                                display: true,
                                text: "Large Particles (pm10 Forecast)",
                                fontSize: 12,
                                fontColor: "#FFFFFF",
                              },
                              legend: {
                                display: false,
                              },
                            }}
                          />
                          <Line
                            data={pm25Data}
                            options={{
                              responsive: true,
                              scales: {
                                yAxes: [
                                  {
                                    ticks: {
                                      beginAtZero: true,
                                      fontColor: "white",
                                    },
                                  },
                                ],
                                xAxes: [
                                  {
                                    ticks: {
                                      beginAtZero: true,
                                      fontColor: "white",
                                    },
                                  },
                                ],
                              },
                              tooltips: {
                                mode: "index",
                                intersect: false,
                                callbacks: {
                                  label: function (tooltipItem) {
                                    return (
                                      Number(tooltipItem.yLabel) + " µg/m³"
                                    );
                                  },
                                },
                                displayColors: true,
                              },
                              title: {
                                display: true,
                                text: "Small Particles (pm2.5 Forecast)",
                                fontSize: 12,
                                fontColor: "#FFFFFF",
                              },
                              legend: {
                                display: false,
                              },
                            }}
                          />
                          <Line
                            data={uviData}
                            options={{
                              responsive: true,
                              scales: {
                                yAxes: [
                                  {
                                    ticks: {
                                      beginAtZero: true,
                                      fontColor: "white",
                                    },
                                  },
                                ],
                                xAxes: [
                                  {
                                    ticks: {
                                      beginAtZero: true,
                                      fontColor: "white",
                                    },
                                  },
                                ],
                              },
                              tooltips: {
                                mode: "index",
                                intersect: false,
                                callbacks: {
                                  label: function (tooltipItem) {
                                    return Number(tooltipItem.yLabel) + " UV";
                                  },
                                },
                                displayColors: true,
                              },
                              title: {
                                display: true,
                                text: "Ultra Violet Index (UVI Forecast)",
                                fontSize: 12,
                                fontColor: "#FFFFFF",
                              },
                              legend: {
                                display: false,
                              },
                            }}
                          />
                        </div>
                      ) : (
                        <div>
                          <h1>Welcome!</h1>
                          <h2>To use this app, click any pin on the map to view detailed information about that location.</h2>
                        </div>
                      )}
                    </CardContent>
                    <CardActions>
                      <div className="save">
                        {this.state.data !== false ? (
                          <IconButton
                            className={"upload-icon"}
                            disabled={saveDisabled}
                            onClick={this.addLocation}
                          >
                            <SaveAltIcon fontSize="large" />
                          </IconButton>
                        ) : null}
                      </div>
                    </CardActions>
                  </Card>
                ) : null}
                {this.state.showUserLocations ? (
                  <Card
                    className='detail-card'
                    variant="outlined"
                    style={{ overflow: "auto" }}
                  >
                    <CardContent>
                      <Typography vcolor="textSecondary" gutterBottom>
                        Saved Locations
                      </Typography>
                      <div className="next">
                        <IconButton
                          onClick={this.showStats}
                          className="go-and-back"
                          color="white"
                          aria-label="next"
                        >
                          <ArrowBackIosIcon />
                        </IconButton>
                      </div>
                      <UserLocations
                        locations={this.state.myLocations}
                        clicked={this.goToLocation}
                      />
                    </CardContent>
                  </Card>
                ) : null}
              </div>
            </Grid>
          </Grid>
        </div>
      </ThemeProvider>
    );
  }
}
document.body.style = "background: #424242;";

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    locations: state.locations,
    stats: state.stats,
  };
};

const mapDispatchToProps = {
  createLocationSuccess,
};

const WrappedContainer = GoogleApiWrapper({
  apiKey: "AIzaSyDmc1KD6Xr80d3hduc4Q2MObw1uotQuY-8",
})(ClimateMap);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedContainer);
