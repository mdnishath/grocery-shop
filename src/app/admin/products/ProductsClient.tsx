"use client";

import { useState } from "react";
import ProductFormModal from "./ProductFormModal";
import ProductTable from "./ProductTable";
import { Product } from "@/types/product";

export default function ProductsClient({ products }: { products: Product[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const openAddModal = () => {
    setEditProduct(null);
    setIsOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditProduct(product);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditProduct(null); // ✅ reset edit state after closing
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">Products</h1>
        <button
          onClick={openAddModal}
          className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
        >
          + Add Product
        </button>
      </div>

      <ProductTable products={products} onEdit={openEditModal} />

      <ProductFormModal
        isOpen={isOpen}
        onClose={closeModal}
        mode={editProduct ? "edit" : "add"}
        initialProduct={editProduct || undefined}
      />
    </>
  );
}
