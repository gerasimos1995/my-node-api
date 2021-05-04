import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import ProductForm from "../ProductForm";
import ProductsList from "../ProductsList";

const Dashboard = () => {
  const {
    currentUser: { id: id, role: role, username: username },
  } = useContext(AuthContext);

  console.log("current user: ", id, role, username);

  return (
    <>
      {role === "shop_owner" ? (
        <>
          <ProductForm />
          <ProductsList />
        </>
      ) : (
        <h2>Ho</h2>
      )}
    </>
  );
};

export default Dashboard;
