import React, { useContext } from "react";
import { ProductsContext } from "../../contexts/ProductsContext";
import {
  ProductsContainer,
  ProductsWrapper,
  ProductsH1,
  ProductCard,
  ProductIcon,
  ProductP,
  ProductH2,
  ProductH3,
} from "./ProductsListElements";
import img from "../../images/photo.png";

const ProductsList = () => {
  const { products } = useContext(ProductsContext);

  return (
    <>
      <ProductsContainer id="products_list">
        <ProductsH1>Your Products</ProductsH1>
        <ProductsWrapper>
          {products.map((product) => (
            <ProductCard key={product._id}>
              <ProductIcon src={img} />
              <ProductH2>{product.title}</ProductH2>
              <ProductP>{product.category}</ProductP>
              <ProductH3>{product.price}</ProductH3>
            </ProductCard>
          ))}
        </ProductsWrapper>
      </ProductsContainer>
    </>
  );
};

export default ProductsList;
