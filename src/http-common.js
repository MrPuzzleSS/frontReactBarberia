import axios from "axios";

export default axios.create({
    baseURL: "https://restapibarberia.onrender.com/api/",
    headers: {
        "Content-Type": "application/json"
    }
});

