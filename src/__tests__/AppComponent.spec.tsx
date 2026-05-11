import App from "../App";
import { screen } from "@testing-library/react";
import { render } from "../../test/test-utils";

jest.mock("../supabaseClient", () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
    }),
  },
}));

describe("title", () => {
  it("should render title", async () => {
    render(<App />);
    expect(await screen.findByText("シン・学習記録")).toBeInTheDocument();
  });
});
