import {render, getMockContextProps} from "@stripe/ui-extension-sdk/testing";
import {ContextView} from "@stripe/ui-extension-sdk/ui";

import ProductListView from "./ProductListView";

describe("ProductListView", () => {
  it("renders ContextView", () => {
    const {wrapper} = render(<ProductListView {...getMockContextProps()} />);

    expect(wrapper.find(ContextView)).toContainText("save to reload this view");
  });
});
