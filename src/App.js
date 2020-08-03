import React, { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      items: [],
      stationInfo: [],
    };
  }

  MBTA_BASE_URL = "https://api-v3.mbta.com/";
  MBTA_KEY = "api_key=e16eddfdad1f4f4b9396df48327e8543";

  getData = () => {
    fetch(
      this.MBTA_BASE_URL +
        "/predictions?filter[stop]=North%20Station&include=schedule,route,stop,trip,vehicle&sort=departure_time&" +
        this.MBTA_KEY
    )
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          isLoaded: true,
          items: json["data"],
          stationInfo: json["included"],
        });
      });
  };

  componentDidMount() {
    this.getData();
    setInterval(this.getData, 60000);
  }

  checkTracker(index) {
    var trackerNum = this.state.stationInfo[index].attributes.platform_code;
    if (!trackerNum) {
      return "TBD";
    } else {
      return trackerNum;
    }
  }

  getDepartureTime(index) {
    var time = this.state.items[index].attributes.departure_time;
    if (!time) {
      return "TBD";
    } else {
      return time.split("T")[1].split("-")[0];
    }
  }

  getDestination(index) {
    var routeId = this.state.items[index].relationships.route.data.id;
    console.log("routeID: ", routeId);
    var direction = this.state.items[index].attributes.direction_id;
    console.log("Direction: ", direction);
    var ans = this.state.stationInfo.map((info) => {
      // console.log(info);
      if (info.id == routeId) {
        console.log("Info:", info.id);
        console.log(
          "destination: ",
          info.attributes.direction_destinations[direction]
        );
        return info.attributes.direction_destinations[direction];
      }
    });
    return ans;
  }

  render() {
    var { isLoaded, items } = this.state;
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time = today.getHours() + ":" + today.getMinutes();

    if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className='App'>
          <h1>North Station Departure Board</h1>
          <h2 className='date'>{date}</h2>
          <h2 className='time'>{time}</h2>
          <ul>
            {items.map((item, index) => (
              <li key={item.id}>
                CARRIER: MBTA | TIME:{this.getDepartureTime(index)} |
                DESTINATION: {this.getDestination(index)} | TRAIN#:{" "}
                {item.id.split("-")[5]} | TRACK#: {this.checkTracker(index + 4)}
                | STATUS: {item.attributes.status}
              </li>
            ))}
          </ul>
        </div>
      );
    }
  }
}

export default App;
