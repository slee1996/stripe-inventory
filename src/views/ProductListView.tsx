/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { ContextView } from "@stripe/ui-extension-sdk/ui";
import InventoryManagement from "./Inventory";

const ProductListView = () => {
  return (
    <ContextView title='Inventory Management'>
      <InventoryManagement />
    </ContextView>
  );
};

export default ProductListView;
