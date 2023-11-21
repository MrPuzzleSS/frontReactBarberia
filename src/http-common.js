import axios from "axios";

export default axios.create({
    baseURL: "https://resapibarberia.onrender.com/api/",
    headers: {
        "Content-Type": "application/json"
    }
});