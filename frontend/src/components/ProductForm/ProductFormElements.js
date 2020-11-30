import styled from 'styled-components'

export const Container = styled.div`
    min-height: 692px;
    max-height: 850px;
    position: relative;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1;
    overflow: hidden;
    background: linear-gradient(45deg, rgba(189,195,199,1) 19%, rgba(113,132,152,1) 45%, rgba(44,62,80,1) 90%);
`

export const FormWrapper = styled.div`
    padding-top: 30px;
    padding-bottom: 50px;
    height: 100;
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media screen and (max-widith: 400px){
        height: 80%;
    }
`

export const FormContent = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media screen and (max-width) {
        padding: 10px;
    }
`

export const Form = styled.form`
    background: #010101;
    width: 650px;
    height: auto;
    z-index: 1;
    display: grid;
    margin: 0 auto;
    padding: 80px 32px;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);

    @media screen and (max-width: 692px){
        width: 300px;
    }

    @media screen and (max-width: 400px){
        padding: 32px 32px;
    }
`

export const FormH1 = styled.h1`
    margin-bottom: 40px;
    color: #fff;
    font-size: 20px;
    font-weight: 400;
    text-align: center;
`

export const FormLabel = styled.label`
    margin-bottom: 8px;
    font-size: 14px;
    color: #fff;
`

export const FormInput = styled.input`
    padding: 16px 16px;
    margin-bottom: 32px;
    border: none;
    border-radius: 4px;
`

export const FormButton = styled.button`
    background: #2f6780;
    padding: 16px 0;
    border: none;
    border-radius: 4px;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
`