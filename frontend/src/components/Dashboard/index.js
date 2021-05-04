import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import ProductForm from "../ProductForm";
import ProductsList from "../ProductsList";

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);

  console.log(currentUser);

  return (
    <>
      <ProductForm />
      <ProductsList />
    </>
  );
};

export default Dashboard;
