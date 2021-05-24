import React from "react";
import { withRouter } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Dashboard from "./Dashboard";
import Login from "./Login";
import DonateDashboard from './DonateDashboard'
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { logoutUser } from "../actions/auth";
import { connect } from "react-redux";
import NewsFeed from "./NewsFeed";
import { useHistory } from "react-router";
import Clymanew from "../images/Clymanew.png"

const NavBar = (props) => {
  const { match, history } = props;
  const { params } = match;
  const { page } = params;

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#83ffe1",
      },
      secondary: {
        main: "#FFFFFF",
      },
    },
  });

  const tabNameToIndex = {
    0: "map",
    1: "news",
    2: "donate",
    3: "login",
  };
  const indexToTabName = {
    map: 0,
    news: 1,
    donate: 2,
    login: 3,
  };

  const [selectedTab, setSelectedTab] = React.useState(indexToTabName[page]);

  const handleChange = (event, newValue) => {
    history.push(`${tabNameToIndex[newValue]}`);
    setSelectedTab(newValue);
  };

  const handleLogout = () => {
    history.push("/login");
    localStorage.removeItem("token");
  };

  const loginClicked = () => {
    history.push("/login");
  };

  const logoClick = () => {
    history.push("/");
  }

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" zIndex={2}>
        <div className="menu2">
          <Tabs
            value={selectedTab}
            onChange={handleChange}
            indicatorColor="primary"
          >
            <Tab label="Map" className={"menu-tab"} />
            {/* <Tab label="News" className={"menu-tab"} />
            <Tab label="Donate" className={"menu-tab"} /> */}
            <div class='nav-logo'>
           
            </div>
            {props.auth ? (
              <div className={"menu-logout-tab"}>
                <Tab
                  label="Logout"
                  onClick={handleLogout}
                  className={"menu-tab"}
                />
              </div>
            ) : (
              <div className={"menu-login-tab"}>
                <Tab onClick={loginClicked} label="Login" />
              </div>
            )}
          </Tabs>
        </div>
      </AppBar>
      {selectedTab === 0 && <Dashboard {...props} />}
      {selectedTab === 1 && <NewsFeed {...props} />}
      {selectedTab === 2 && <DonateDashboard {...props} />}
      {selectedTab === 3 && (
        <Login style={{ backgroundColor: "#303030" }} {...props} />
      )}

    </ThemeProvider>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = {
  logoutUser,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));
