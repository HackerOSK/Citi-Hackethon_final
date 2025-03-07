// take the data from the dashboard and post it to the server

import axios from 'axios';

const postCreditData = async (data) => {
    const response = await axios.post('http://localhost:8000/api/credit-data', data);
    return response.data;
}

export default postCreditData;

