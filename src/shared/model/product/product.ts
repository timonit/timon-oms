export type Product = {
  id: string;
  name: string;
  price: number;
  type: string;
  // Optional field for the product's EAN (European Article Number)
  ean?: string;
  availableModifications: string[];
};
