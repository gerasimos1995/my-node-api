import jwtDecode from 'jwt-decode'
import axios from 'axios'

const jwtValidate = (jwt_token) => {
    let decoded = jwtDecode(jwt_token)
    var dateNow = new Date();

    if(decoded.exp < (dateNow.getTime()/1000)){
        console.log("Access token is expired")
        return false // access token is expired
    }
    // Access token is not expired
    return true
}

export const jwtRefresh = async () => {
    let accessToken = localStorage.getItem('Access Token')

    if (jwtValidate(accessToken)) return "Success"

    console.log("Trying to create a new valid access token")
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }

    const postData = {
        accessToken: accessToken
    }

    try {
        const result = await axios.post("http://localhost:3000/api/auth/token", postData, { headers })
        localStorage.setItem("Access Token", `Bearer ${result.data.AccessToken}`)
        return "Success"
    } catch (error) {
        console.log(error)
        return "Failure"
    }
    
}