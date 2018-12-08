import axios from "axios";

const url ='http://localhost:3000';

export const getCoins=async ()=>{
   const response=await axios({
        url: `${url}/coin`,
        method: 'get',
        data: {
        }
    })
    return response
};
export const getAverage=async (from, to)=>{
   const response=await axios.get(`${url}/price/average`, {
       params: {
           from,
           to
       }
   })
    return response
};
export const getDetails=async (from, to)=>{
   const response=await axios.get(`${url}/price`, {
       params: {
           from,
           to
       }
   })
    return response
};

