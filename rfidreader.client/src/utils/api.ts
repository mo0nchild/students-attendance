import axios from "axios";
import config from './../../configuration.json'

// export const apiBaseUrl = `https://127.0.0.1:8443/api`
export const apiBaseUrl = `https://${config.backendIP}:${config.backendPort}/api`
export const apiKey = '73e259e9-afb3-490b-ace1-b19c31bec8a5'

const $api = axios.create({
    baseURL: apiBaseUrl,
    headers: { 'API-KEY': apiKey }
})

export default $api