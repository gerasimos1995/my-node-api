const ProductsReducer = (state, action) => {
  switch (action.type) {
    case "ADD_PRODUCT":
      return {
        ...state,
        products: [
          {
            category: action.payload.category,
            title: action.payload.title,
            price: action.payload.price,
            provider: action.payload.provider,
            trader: action.payload.trader,
          },
          ...state.products,
        ],
      };
    case "ADD_PRODUCTS":
      return {
        ...state,
        products: action.payload,
      };
    default:
      return state;
  }
};

export default ProductsReducer;
