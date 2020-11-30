import React, { useContext, useEffect } from 'react'
import { ProductsContext } from '../../contexts/ProductsContext'
import { ProductsContainer,
        ProductsWrapper,
        ProductsH1,
        ProductCard,
        ProductIcon,
        ProductP,
        ProductH2,
        ProductH3
    } from './ProductsListElements'
import { jwtRefresh } from '../../util/jwtRefresh'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import img from '../../images/photo.png'

const ProductsList = () => {
    const history = useHistory()

    const { products, addProducts } = useContext(ProductsContext)

    async function fetchProducts() {
        
        try {
            const res = await jwtRefresh()

            if (res === "Failure"){
                console.log("Could not refresh the invalid Access Token")
                //localStorage.removeItem('Access Token')
                //setLoading(false)
                //history.push('/login')
            } else {
                const token = localStorage.getItem('Access Token')

                const headers = {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': token
                }

                const result = await axios.get('http://localhost:3000/api/products', { headers })
                console.log(result.data.products)
                addProducts(result.data.products)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <>
            <ProductsContainer id="products_list">
                <ProductsH1>Your Products</ProductsH1>
                <ProductsWrapper>
                    {/* {Object.keys(products).map((item, i) => (
                        <ProductCard key={item._id}>
                            <ProductIcon src={img}/>
                            <ProductH2>{item.title}</ProductH2>
                            <ProductP>{item.category}</ProductP>
                            <ProductH3>{item.price}</ProductH3>
                        </ProductCard>
                    ))} */}
                    {/* <ProductCard key={item._id} {...products[item]}/> */}
                    {products.map(product => (
                        <ProductCard key={product._id}>
                            <ProductIcon src={img}/>
                            <ProductH2>{product.title}</ProductH2>
                            <ProductP>{product.category}</ProductP>
                            <ProductH3>{product.price}</ProductH3>
                        </ProductCard>
                    ))} 
                </ProductsWrapper>
            </ProductsContainer>
        </>
    )
}

export default ProductsList
