export type Product = {
  name: string;
  price: number;
  type: string;
  // Optional field for the product's EAN (European Article Number)
  ean?: string;
};
