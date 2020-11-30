import React, { useReducer, createContext } from 'react'
import ProductsReducer from '../reducers/ProductsReducer'

// product = {
//     category: string,
//     title: string,
//     price: string,
//     provider: string,
//     trader: id
// }

// Setting initial state
const initialState = {
    products : []
}

// Creating context
export const ProductsContext = createContext(initialState)

// Context Provider
export const ProductsProvider = ({children}) => {
    const [state, dispatch] = useReducer(ProductsReducer, initialState)

    // Actions
    function addProduct(product) {
        dispatch({
            type: 'ADD_PRODUCT',
            payload: {
                category: product.category,
                title: product.title,
                price: product.price,
                provider: product.provider,
                trader: product.trader
            }
        })
    }

    function addProducts(products) {
        dispatch({
            type: 'ADD_PRODUCTS',
            payload: products
        })
    }

    return (
        <ProductsContext.Provider value={{ products: state.products, addProduct, addProducts }}>
            {children}
        </ProductsContext.Provider>
    )
}
