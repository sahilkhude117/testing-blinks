import axios from 'axios';

const BASE_URL = 'https://demo-api.kalshi.co/trade-api/v2';

export async function getMarket(ticker:string) {
    const res = await axios.get(`${BASE_URL}/markets/${ticker}`);
    return res.data;
}