// API to get the credit score of a business

import axios from 'axios';

export const getCreditScore = async (gst_in) => {
    try {
        const response = await axios.get(`http://192.168.1.6:5000/get_credit_score?gst_in=${gst_in}`);
        return response.data.credit_score;
    } catch (error) {
        console.error('Error fetching credit score:', error);
        throw error;
    }
}

export default getCreditScore;
