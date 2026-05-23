import axios from "axios"
import type { CareResult } from "../types/CareResult";

const API_URL = "http://localhost:8000";

export async function analyzeImage(file: File): Promise<CareResult> {
    const formData = new FormData(); // sending file over HTTP
    formData.append("file", file);

    const response = await axios.post(`${API_URL}/api/analyze`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    
    return response.data as CareResult;
}