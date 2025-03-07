// Get details by GSTIN http://127.0.0.1:5000/get_testcase?gst_in=YOUR_GST_IN

// Import necessary modules
import axios from 'axios';

// Function to get details by GSTIN
export const getDetailsByGSTIN = async (gstin) => {
    try {
        const response = await axios.get(`http://192.168.1.6:5000/get_testcase?gst_in=${gstin}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching details:', error);
        throw error;
    }
};

// Example usage
