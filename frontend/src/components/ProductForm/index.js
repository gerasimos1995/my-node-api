import React, { useContext, useState, useRef, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import {
  Container,
  FormWrapper,
  FormContent,
  Form,
  FormH1,
  FormInput,
  FormLabel,
  FormButton,
} from "./ProductFormElements";
import { ProductsContext } from "../../contexts/ProductsContext";
import axios from "axios";
import { jwtRefresh } from "../../util/jwtRefresh";

const ProductForm = () => {
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const { products, addProduct } = useContext(ProductsContext);

  useEffect(() => {
    console.log("Products: ", products);
  }, [products]);

  const titleRef = useRef();
  const categoryRef = useRef();
  const priceRef = useRef();
  const providerRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const postData = {
      title: titleRef.current.value,
      category: categoryRef.current.value,
      price: priceRef.current.value,
      provider: providerRef.current.value,
    };
    //,trader: user_info.id

    try {
      const res = await jwtRefresh();
      if (res === "Failure") {
        console.log("Could not refresh the invalid Access Token");
        localStorage.removeItem("Access Token");
        setLoading(false);
        history.push("/login");
      } else {
        const token = localStorage.getItem("Access Token");
        const jwt_token = token && token.split(" ")[1];

        const headers = {
          Authorization: `Bearer ${jwt_token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        };

        // postData, headers) didn't work it needs { headers }
        const result = await axios.post(
          "http://localhost:3000/api/products",
          postData,
          { headers }
        );
        var new_product = result.data.product;
        addProduct(new_product);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to add product to shop-owner");
      setLoading(false);
    }
  }

  return (
    <>
      <Container>
        <FormWrapper>
          <FormContent>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <FormH1>Add a new product</FormH1>
              <FormLabel htmlFor="title">Title</FormLabel>
              <FormInput type="text" name="title" ref={titleRef}></FormInput>
              <FormLabel htmlFor="category">Category</FormLabel>
              <FormInput
                type="text"
                name="category"
                ref={categoryRef}
              ></FormInput>
              <FormLabel htmlFor="price">Price</FormLabel>
              <FormInput type="number" name="price" ref={priceRef}></FormInput>
              <FormLabel htmlFor="provider">Provider</FormLabel>
              <FormInput
                type="text"
                name="provider"
                ref={providerRef}
              ></FormInput>
              <FormButton type="submit" disabled={loading}>
                Add product
              </FormButton>
            </Form>
          </FormContent>
        </FormWrapper>
      </Container>
    </>
  );
};
// product = {
//     category: string,
//     title: string,
//     price: string,
//     provider: string,
//     trader: id
// }
export default ProductForm;
