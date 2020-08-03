import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

it("API testing", async function () {
  const response = new App();
  var data = await response.getData();
  expect(data.items[0].id).toEqual("2113");
  expect(response.getDepartureTime(0)).toEqual("23:30:00");
  expect(response.checkTracker(0)).toEqual("1");
  expect(response.getDestination(0)).toEqual("North Station");
  expect(response.checkTracker(0).toEqual("1"));
});
