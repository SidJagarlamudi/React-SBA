import React, { Component } from "react";

export class SearchForm extends Component {
  state = {
    text: "",
  };

  handleChange = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={this.state.text}
            onChange={this.handleChange}
          />
          <input type="submit" value="Search!" />
        </form>
      </div>
    );
  }
}

export default SearchForm;
