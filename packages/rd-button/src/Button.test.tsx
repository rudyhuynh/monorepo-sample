import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Button } from "./Button";

test("Button should render without crash", async () => {
  render(<Button />);
});
