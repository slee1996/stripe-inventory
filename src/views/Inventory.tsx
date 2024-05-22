/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@stripe/ui-extension-sdk/ui";
import Stripe from "stripe";
import {
  createHttpClient,
  STRIPE_API_KEY,
} from "@stripe/ui-extension-sdk/http_client";

const stripe: Stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient() as Stripe.HttpClient,
  apiVersion: "2022-11-15",
});

const useAllProducts = () => {
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    stripe.products
      .list({
        limit: 100,
      })
      .then((resp) => {
        if (resp.data.length === 100) {
          const firstSet = resp.data;
          stripe.products
            .list({
              limit: 100,
              starting_after: firstSet.slice(-1)[0].id,
            })
            .then((resp) => setAllProducts([...firstSet, ...resp.data]));
        } else {
          setAllProducts(resp.data);
        }
      });
  }, []);

  return allProducts;
};

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const products = useAllProducts();

  useEffect(() => {
    setInventory(products);
  }, [products]);

  const increaseInventory = async (item) => {
    const currentCount = item.metadata.inventory ?? 0;
    const updatedItem = await stripe.products.update(item.id, {
      metadata: { inventory: Number(currentCount) + 1 },
    });
    setInventory(
      inventory.map((product) => {
        return product.id === updatedItem.id ? updatedItem : product;
      })
    );
  };

  const decreaseInventory = async (item) => {
    const currentCount = item.metadata.inventory ?? 0;
    if (currentCount === 0) return;

    const updatedItem = await stripe.products.update(item.id, {
      metadata: { inventory: Number(currentCount) - 1 },
    });
    setInventory(
      inventory.map((product) => {
        return product.id === updatedItem.id ? updatedItem : product;
      })
    );
  };

  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Action</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            // eslint-disable-next-line react/prop-types
            inventory.map((item) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Button onClick={() => decreaseInventory(item)}>-</Button>
                    <Button disabled>{item.metadata.inventory ?? 0}</Button>
                    <Button onClick={() => increaseInventory(item)}>+</Button>
                  </TableCell>
                </TableRow>
              );
            })
          }
        </TableBody>
      </Table>
    </Box>
  );
};

export default InventoryManagement;
