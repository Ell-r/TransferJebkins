import axiosInstance from "../../api/axiosInstance.ts";

export const GetAll = async() =>{
    try {
        const response = await axiosInstance.get("/Country");
        return response.data;
    }
    catch(error){
        console.log(error)
    }
}