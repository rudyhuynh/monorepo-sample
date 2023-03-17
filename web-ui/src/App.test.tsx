import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

test("App should render without crash", async () => {
  render(<App />);
});
