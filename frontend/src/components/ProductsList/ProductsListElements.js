import styled from 'styled-components'

export const ProductsContainer = styled.div`
    height: 800px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #010606;

    @media screen and (max-width: 768px){
        height: 1100px;
    }

    @media screen and (max-width: 480px){
        height: 1300px;
    }
`

export const ProductsWrapper = styled.div`
    max-width: 1000px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    grid-gap: 16px;
    padding: 0 50px;

    @media screen and (max-width: 1000px){
        grid-template-columns: 1fr 1fr;
    }

    @media screen and (max-width: 768px){
        grid-template-columns: 1fr;
        padding: 0 20px;
    }
`

export const ProductCard = styled.div`
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    border-radius: 10px;
    min-height: 300px;
    max-height: 300px;
    padding: 30px;
    box-shadow: 0 1px 3px rgba(0, 0, 0.2);
    transition: all 0.2s ease-in-out;
    z-index: 1;

    &:hover {
        transform: scale(1.02);
        transition: all 0.2s ease-in-out;
        cursor: pointer;
    }
`

export const ProductIcon = styled.img`
    height: 160px;
    width: 160px;
    margin-bottom: 10px;
`

export const ProductsH1 = styled.h1`
    font-size: 2.5rem;
    color: #fff;
    margin-bottom: 64px;

    @media screen and (max-width){
        font-size: 2rem;
    }
`

export const ProductH2 = styled.h2`
    font-size: 1rem;
    margin-bottom: 10px;
`

export const ProductP = styled.p`
    font-size: 1rem;
    text-align: center;
    margin-bottom: 10px;
`

export const ProductH3 = styled.h2`
    font-size: 0.7rem;
    margin-bottom: 10px;
`