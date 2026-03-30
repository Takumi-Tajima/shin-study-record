import App from "../App";
import { render, screen } from "@testing-library/react";

describe("title", () => {
  it("should render title", () => {
    render(<App />);
    expect(screen.getByText("Hello Nakajima")).toBeInTheDocument();
  });
});

// この状態ではspecが落ちてしまうので、カスタムレンダーなるものを利用して、ProvidetでAppを囲うようにしてみようと思う
// カスタムレンダーのURLhttps://testing-library.com/docs/react-testing-library/setup/#custom-render
// あんまり時間かけすぎないようにする
// specが落ちる原因はChakraProviderがないからだと思うので、これを追加してあげる必要がある
