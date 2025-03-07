// /get_social_analysis
import axios from 'axios';

export const getSocialAnalysis = async (gst_in) => {
    const response = await axios.get(`http://localhost:5000/get_social_analysis?gst_in=${gst_in}`);
    return response.data;
};
