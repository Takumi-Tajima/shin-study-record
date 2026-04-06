import App from "../App";
import { screen } from "@testing-library/react";
import { render } from "../../test/test-utils";

describe("title", () => {
  it("should render title", () => {
    render(<App />);
    expect(screen.getByText("Hello Nakajima")).toBeInTheDocument();
  });
});
