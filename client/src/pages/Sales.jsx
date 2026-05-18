import {
  useEffect,
  useMemo,
  useState,
} from "react";

import SalesTable from "../components/SalesTable";

import { getProducts }
from "../services/product.service";

import { getCustomers }
from "../services/customer.service";

import { createSale }
from "../services/sale.service";

const Sales = () => {

  const [products, setProducts] =
    useState([]);

  const [customers, setCustomers] =
    useState([]);

  const [selectedCustomer,
    setSelectedCustomer] =
    useState("");

  const [selectedProduct,
    setSelectedProduct] =
    useState("");

  const [saleItems, setSaleItems] =
    useState([]);

  useEffect(() => {

    const fetchData = async () => {

      const productsData =
        await getProducts();

      const customersData =
        await getCustomers();

      setProducts(productsData);

      setCustomers(customersData);
    };

    fetchData();

  }, []);

  const handleAddProduct = () => {

    const product =
      products.find(
        (p) =>
          p.id === selectedProduct
      );

    if (!product) return;

    const exists =
      saleItems.find(
        (item) =>
          item.id === product.id
      );

    if (exists) return;

    setSaleItems([
      ...saleItems,
      {
        ...product,
        quantity: 1,
      },
    ]);
  };

  const handleQuantityChange = (
    id,
    quantity
  ) => {

    setSaleItems(
      saleItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                Number(quantity),
            }
          : item
      )
    );
  };

  const handleRemove = (id) => {

    setSaleItems(
      saleItems.filter(
        (item) =>
          item.id !== id
      )
    );
  };

  const totalAmount = useMemo(() => {

    return saleItems.reduce(
      (total, item) =>
        total +
        item.price *
          item.quantity,
      0
    );

  }, [saleItems]);

  const handleCreateSale =
    async () => {

      try {

        const payload = {
          customer_id:
            selectedCustomer || null,

          user_id:
            "367d46d6-b597-46a0-885b-9d2be6427d2e",

          items:
            saleItems.map(
              (item) => ({
                product_id:
                  item.id,

                quantity:
                  item.quantity,
              })
            ),
        };

        await createSale(payload);

        alert("Sale created");

        setSaleItems([]);

      } catch (error) {

        console.error(error);

      }
    };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 sm:p-6">

      <div className="flex flex-col gap-4">

        <div>

          <h1 className="text-2xl sm:text-3xl font-semibold">
            Sales
          </h1>

          <p className="text-zinc-400 mt-1">
            Create invoices and sales
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <select
            value={selectedCustomer}
            onChange={(e) =>
              setSelectedCustomer(
                e.target.value
              )
            }
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3"
          >

            <option value="">
              Walk-in Customer
            </option>

            {customers.map(
              (customer) => (
                <option
                  key={customer.id}
                  value={customer.id}
                >
                  {customer.name}
                </option>
              )
            )}

          </select>

          <select
            value={selectedProduct}
            onChange={(e) =>
              setSelectedProduct(
                e.target.value
              )
            }
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3"
          >

            <option value="">
              Select Product
            </option>

            {products.map(
              (product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name}
                </option>
              )
            )}

          </select>

          <button
            onClick={
              handleAddProduct
            }
            className="bg-blue-500 hover:bg-blue-600 rounded-lg px-4 py-3"
          >
            Add Product
          </button>

        </div>

      </div>

      <SalesTable
        saleItems={saleItems}
        onQuantityChange={
          handleQuantityChange
        }
        onRemove={handleRemove}
      />

      <div className="mt-6 flex items-center justify-between">

        <h2 className="text-2xl font-semibold">

          Total:
          ₹{totalAmount}

        </h2>

        <button
          onClick={
            handleCreateSale
          }
          className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-lg font-medium"
        >
          Complete Sale
        </button>

      </div>

    </div>
  );
};

export default Sales;