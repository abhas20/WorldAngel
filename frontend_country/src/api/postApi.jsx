import axios from 'axios'

const api=axios.create({
    baseURL:"https://restcountries.com/v3.1/"
})

export const getData=()=>{
    return api.get("all?fields=flags,name,population,region,car,area,capital")
}

export const getIndData=(country)=>{
    return api.get(`name/${country}`)
}