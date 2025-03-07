import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BiRightArrowAlt as ArrowRight } from 'react-icons/bi';
import { BiCheckCircle as CheckCircle } from 'react-icons/bi';
import { Squares } from '../components/Squares';
import { useNavigate } from 'react-router-dom';
import { getDetailsByGSTIN } from '../API/getDetailsByGSTIN';
import { getCreditScore } from '../API/getCreditScore';
import { getSocialAnalysis } from '../API/getSocialAnalysis';
import axios from 'axios';

const GSTVerificationPage = () => {
  const [gstNumber, setGstNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [businessDetails, setBusinessDetails] = useState(null);
  const navigate = useNavigate();

  const handleGSTSubmit = async (e) => {
    e.preventDefault();

    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    
    if (!gstRegex.test(gstNumber)) {
      setVerificationStatus('invalid');
      return;
    }
    
    setIsVerifying(true);
    setVerificationStatus('verifying');
    
    try {
      const details = await getDetailsByGSTIN(gstNumber);
      console.log("GST Details:", details);
      
      setIsVerifying(false);
      setVerificationStatus('success');
      
      let creditScore = null;
      try {
        creditScore = await getCreditScore(gstNumber);
        console.log("Credit Score:", creditScore);
      } catch (creditError) {
        console.error("Error fetching credit score:", creditError);
      }
      
      // Fetch social analysis data
     
      
      const businessData = {
        name: "Business with GST: " + details.GST_IN,
        address: "Annual Revenue: " + details.Annual_Revenue + ", Loan Amount: " + details.Loan_Amount,
        type: "Bank Transactions: " + details.Bank_Transactions,
        registrationDate: new Date().toLocaleDateString(),
        status: "Active",
        financialHealth: details.Financial_Health,
        creditUtilization: details.Credit_Utilization,
        industryRisk: details.Industry_Risk,
        creditScore: creditScore
      };

      setBusinessDetails(businessData);

      await postCreditData({
        user_id: 1,
        gst_in: gstNumber,
        annual_revenue: details.Annual_Revenue,
        loan_amount: details.Loan_Amount,
        gst_compliance: 95,
        past_defaults: 0,
        bank_transactions: details.Bank_Transactions,
        market_trend: 1,
        credit_score: creditScore,
        financial_health: details.Financial_Health,
        repayment_history: 90,
        credit_utilization: details.Credit_Utilization,
        industry_risk: details.Industry_Risk
      });

      // Navigate to dashboard with all the data
      

    } catch (error) {
      console.error('Error:', error);
      setIsVerifying(false);
      setVerificationStatus('error');
      alert("Error connecting to the server. Please make sure the server is running.");
    }
  };

  const postCreditData = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/post_credit_data', data);
      console.log('Data stored successfully:', response.data);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  return (
    <Squares 
      speed={0.2} 
      squareSize={50}
      direction='diagonal'
      borderColor='rgba(59, 130, 246, 0.3)'
      hoverFillColor='rgba(139, 92, 246, 0.1)'
    >
      <div className="min-h-screen bg-black/90 text-white overflow-hidden">
        {/* Content */}
        <div className="container mx-auto px-4 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Business Verification
                </span>
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Enter your GST Identification Number to verify your business and unlock enhanced credit scoring features tailored to your industry.
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-900/80 backdrop-blur-md p-8 rounded-xl border border-gray-800 shadow-xl"
            >
              <form onSubmit={handleGSTSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center">
                    GST Identification Number
                    <div className="ml-2 group relative">
                      <span className="cursor-help text-gray-500 text-xs">ⓘ</span>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-64 p-3 bg-gray-800 rounded-lg shadow-lg text-xs text-gray-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 mb-2">
                        Your 15-digit GST Identification Number helps us verify your business details and provide accurate credit assessment.
                      </div>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. 27AAPFU0939F1ZV"
                      className={`w-full p-3 rounded-md bg-gray-800 border ${
                        verificationStatus === 'invalid' 
                          ? 'border-red-500 focus:border-red-500' 
                          : verificationStatus === 'success'
                          ? 'border-green-500 focus:border-green-500'
                          : 'border-gray-700 focus:border-blue-500'
                      } text-white focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500 transition-all`}
                      maxLength="15"
                    />
                    {verificationStatus === 'success' && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 h-5 w-5" />
                    )}
                  </div>
                  {verificationStatus === 'invalid' && (
                    <p className="text-red-500 text-sm">Please enter a valid GST Identification Number</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || gstNumber.length < 15}
                  className={`w-full p-3 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium flex items-center justify-center transition-all ${
                    isVerifying || gstNumber.length < 15 ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isVerifying ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Business <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Business details section */}
              {businessDetails && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.5 }}
                  className="mt-8 pt-6 border-t border-gray-800"
                >
                  <h3 className="text-lg font-medium text-white mb-4">Verified Business Details</h3>
                  <div className="space-y-4 bg-gray-800/50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400">GST Number</p>
                        <p className="text-sm font-medium">{businessDetails.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Registration Status</p>
                        <p className="text-sm font-medium text-green-400">{businessDetails.status}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-400">Financial Information</p>
                      <p className="text-sm">{businessDetails.address}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400">Bank Transactions</p>
                        <p className="text-sm">{businessDetails.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Verification Date</p>
                        <p className="text-sm">{businessDetails.registrationDate}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-400">Financial Health</p>
                        <p className="text-sm">{businessDetails.financialHealth}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Credit Utilization</p>
                        <p className="text-sm">{businessDetails.creditUtilization}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Industry Risk</p>
                        <p className="text-sm">{businessDetails.industryRisk}</p>
                      </div>
                    </div>

                    {businessDetails.creditScore && (
                      <div className="mt-4 p-3 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Credit Score</p>
                        <div className="flex items-center">
                          <div className="text-2xl font-bold text-white">{businessDetails.creditScore}</div>
                          <div className="ml-3 text-xs">
                            {businessDetails.creditScore >= 750 ? (
                              <span className="text-green-400">Excellent</span>
                            ) : businessDetails.creditScore >= 700 ? (
                              <span className="text-green-300">Good</span>
                            ) : businessDetails.creditScore >= 650 ? (
                              <span className="text-yellow-300">Fair</span>
                            ) : (
                              <span className="text-red-400">Poor</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <button 
                      className="w-full p-3 rounded-md bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium flex items-center justify-center"
                      onClick={async () => {
                        // Fetch social analysis data before navigating
                        let socialAnalysisData = null;
                        try {
                          socialAnalysisData = await getSocialAnalysis(gstNumber);
                          console.log("Social Analysis Data:", socialAnalysisData);
                        } catch (socialError) {
                          console.error("Error fetching social analysis data:", socialError);
                        }
                        
                        // Navigate to dashboard with all the data
                        navigate('/dashboard', { 
                          state: { 
                            creditScore: businessDetails.creditScore,
                            gstNumber: gstNumber,
                            businessDetails: {
                              financialHealth: businessDetails.financialHealth,
                              creditUtilization: businessDetails.creditUtilization,
                              industryRisk: businessDetails.industryRisk,
                              bankTransactions: businessDetails.type
                            },
                            sentimentAnalysis: socialAnalysisData // Pass social analysis data to Dashboard
                          } 
                        });
                      }}
                    >
                      Continue to Credit Assessment <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-gray-400">
                Your data is encrypted and secure. We comply with all applicable data protection regulations.
              </p>
              <div className="flex justify-center mt-4 space-x-4">
                <div className="flex items-center text-xs text-gray-500">
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Secure Connection
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Privacy Protected
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Squares>
  );
};

export default GSTVerificationPage;