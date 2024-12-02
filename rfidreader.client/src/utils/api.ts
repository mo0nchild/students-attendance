import axios from "axios";

export const apiBaseUrl = `http://localhost:8080/api`
export const apiKey = '73e259e9-afb3-490b-ace1-b19c31bec8a5'

const $api = axios.create({
    baseURL: apiBaseUrl,
    headers: { 'API-KEY': apiKey }
})

export default $api