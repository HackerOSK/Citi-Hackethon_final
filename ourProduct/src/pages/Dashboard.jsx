import React, { useState, useEffect, useRef } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import CashFlowChart from '../components/CashFlowChart';
import { BiDownload, BiMessageRoundedDetail, BiX, BiCheckCircle, BiErrorCircle, BiInfoCircle, BiDollar, BiTrendingUp, BiCreditCard, BiLineChart, BiPieChart } from 'react-icons/bi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getCreditScore } from '../API/getCreditScore';
import { getSocialAnalysis } from '../API/getSocialAnalysis';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Transaction component
const Transactions = ({ transactionHistory }) => (
  <div className="bg-gray-800 p-4 rounded-lg col-span-full lg:col-span-2">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Recent Transactions</h2>
      <button className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
        View All
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-700">
            <th className="pb-2">Date</th>
            <th className="pb-2">Type</th>
            <th className="pb-2">Amount</th>
            <th className="pb-2">Category</th>
          </tr>
        </thead>
        <tbody>
          {transactionHistory.map((tx, index) => (
            <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
              <td className="py-3">{new Date(tx.date).toLocaleDateString()}</td>
              <td className={`py-3 ${tx.type === "Credit" ? "text-green-400" : "text-red-400"}`}>
                {tx.type}
              </td>
              <td className="py-3">₹{tx.amount.toLocaleString()}</td>
              <td className="py-3">
                <span className="px-2 py-1 rounded-full text-xs bg-gray-700">
                  {tx.category}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// AI Chat Component
const AIChatConsultant = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I\'m your AI financial consultant. How can I help you understand your business metrics today?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on your current credit score of 750, your business is in good financial health. This puts you in a favorable position for loan approvals.",
        "Your risk factor is at 40%, which is moderate. I recommend focusing on reducing operational costs to improve this metric.",
        "Looking at your cash flow trends, there's a positive trajectory. Continue maintaining a healthy balance between credits and debits.",
        "Your market sentiment analysis shows strong positive reception on LinkedIn and Reddit. Consider leveraging these platforms for business growth.",
        "Would you like me to analyze any specific aspect of your financial data in more detail?"
      ];
      
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: responses[Math.floor(Math.random() * responses.length)] 
      }]);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="chatbot-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ backgroundColor: '#111827' }}
        >
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-purple-600">
            <h3 className="font-bold text-white">AI Financial Consultant</h3>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <BiX size={24} />
            </button>
          </div>
          
          <div className="h-80 overflow-y-auto p-4 bg-gray-900">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-3/4 p-3 rounded-lg ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-gray-700 text-white rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t border-gray-700 bg-gray-800 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about your financial metrics..."
              className="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            />
            <button 
              onClick={handleSend}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 rounded-r-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
            >
              Send
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Risk Assessment Card
const RiskAssessmentCard = ({ score, factor }) => {
  // Determine overall risk status
  const getRiskStatus = () => {
    if (score > 700 && factor < 50) return { status: "Low Risk", color: "green", icon: BiCheckCircle };
    if (score > 600 && factor < 70) return { status: "Moderate Risk", color: "yellow", icon: BiInfoCircle };
    return { status: "High Risk", color: "red", icon: BiErrorCircle };
  };
  
  const status = getRiskStatus();
  const Icon = status.icon;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 p-5 rounded-lg col-span-full shadow-lg border-l-4"
      style={{ borderLeftColor: status.color === "green" ? "#2ecc71" : status.color === "yellow" ? "#f39c12" : "#e74c3c" }}
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-full mr-4 ${
          status.color === "green" ? "bg-green-900/50 text-green-400" : 
          status.color === "yellow" ? "bg-yellow-900/50 text-yellow-400" : 
          "bg-red-900/50 text-red-400"
        }`}>
          <Icon size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-1">Business Risk Assessment</h2>
          <p className={`text-lg font-medium ${
            status.color === "green" ? "text-green-400" : 
            status.color === "yellow" ? "text-yellow-400" : 
            "text-red-400"
          }`}>
            {status.status}
          </p>
        </div>
        <div className="ml-auto text-right">
          <div className="text-sm text-gray-400">Credit Score</div>
          <div className="text-lg font-bold">{score} / 900</div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <div className="text-sm text-gray-400">Loan Eligibility</div>
          <div className="text-lg font-medium">
            {score > 700 ? "Excellent" : score > 600 ? "Good" : "Limited"}
          </div>
        </div>
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <div className="text-sm text-gray-400">Interest Rate Range</div>
          <div className="text-lg font-medium">
            {score > 700 ? "8% - 10%" : score > 600 ? "10% - 12%" : "12% - 15%"}
          </div>
        </div>
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <div className="text-sm text-gray-400">Recommended Action</div>
          <div className="text-lg font-medium">
            {factor < 40 ? "Ready for Growth" : factor < 70 ? "Stabilize Operations" : "Reduce Liabilities"}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  // Get credit score and business details from location state
  const navigate = useNavigate();
  const location = useLocation();
  const { creditScore, gstNumber, businessDetails, sentimentAnalysis } = location.state || {};
  
  // Company data
  const sampleTransactions = [
    { date: "2025-02-15", type: "Credit", amount: 300000, category: "Sales" },
    { date: "2025-02-20", type: "Debit", amount: 150000, category: "Operations" },
    { date: "2025-02-25", type: "Credit", amount: 220000, category: "Sales" },
    { date: "2025-03-01", type: "Debit", amount: 180000, category: "Marketing" },
    { date: "2025-03-05", type: "Credit", amount: 280000, category: "Sales" }
  ];
  
  const [data, setData] = useState({
    companyName: "Tech Innovators Pvt Ltd",
    gstin: gstNumber || "29AAACC1234F1Z5",
    loanHistory: [
      { bank: "HDFC Bank", amount: 500000, status: "Paid", interestRate: 9.5 },
      { bank: "ICICI Bank", amount: 750000, status: "Ongoing", interestRate: 8.75 },
      { bank: "Axis Bank", amount: 300000, status: "Paid", interestRate: 10.2 }
    ],
    investmentHistory: [
      { round: "Seed", amount: 200000, investor: "Angel Investor A", date: "2023-05" },
      { round: "Series A", amount: 1500000, investor: "VC Firm X", date: "2024-01" },
      { round: "Series B", amount: 3000000, investor: "Growth Fund Y", date: "2024-11" }
    ],
    transactionHistory: sampleTransactions,
    sentimentAnalysis: sentimentAnalysis || {
      LinkedIn: 0.7,
      Twitter: 0.3,
      Glassdoor: 0.15,
      Reddit: 0.6,
      News: 0.5
    },
    creditScore: creditScore || 750,
    riskFactor: Math.round(creditScore * (0.7 + 0.3 + 0.15 + 0.6 + 0.5) / 5) % 100 + 10,
    stock: { currentPrice: 120.5, changePercentage: 2.3, volume: 25000 }
  });

  // Stock price history - will be dynamically updated
  const [stockHistory, setStockHistory] = useState([
    { date: '2025-02-01', price: 115.2 },
    { date: '2025-02-08', price: 118.4 },
    { date: '2025-02-15', price: 116.9 },
    { date: '2025-02-22', price: 119.8 },
    { date: '2025-03-01', price: 120.5 }
  ]);

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  
  // Function to handle starting the chat
  const handleStartChat = async () => {
    try {
      setIsLoadingChat(true);
      
      // Make sure we have a GST number
      const currentGstNumber = gstNumber || data.gstin;
      
      // Fetch credit score if not already available
      let currentCreditScore = creditScore;
      if (!currentCreditScore) {
        try {
          const creditScoreResponse = await getCreditScore(currentGstNumber);
          currentCreditScore = creditScoreResponse;
          console.log("Credit Score fetched:", currentCreditScore);
        } catch (error) {
          console.error("Error fetching credit score:", error);
        }
      }
      
      // Fetch social analysis data
      let socialAnalysisData = sentimentAnalysis;
      if (!socialAnalysisData) {
        try {
          socialAnalysisData = await getSocialAnalysis(currentGstNumber);
          console.log("Social Analysis Data fetched:", socialAnalysisData);
        } catch (error) {
          console.error("Error fetching social analysis data:", error);
        }
      }
      
      // Navigate to chatbot with all data
      navigate('/credit-ai-chatbot', {
        state: {
          creditScore: currentCreditScore,
          gstNumber: currentGstNumber,
          businessDetails: businessDetails || {
            financialHealth: data.financialHealth,
            creditUtilization: data.creditUtilization,
            industryRisk: data.industryRisk,
            bankTransactions: data.bankTransactions
          },
          sentimentAnalysis: socialAnalysisData
        }
      });
    } catch (error) {
      console.error("Error preparing chat data:", error);
      alert("There was an error preparing the chat data. Please try again.");
    } finally {
      setIsLoadingChat(false);
    }
  };
  
  // Download report function
  const downloadReport = () => {
    // In a real app, this would generate a PDF or Excel file
    navigate('/benford-analysis');
    // Simulate download delay
    
  };

  // Real-time stock price simulation
  useEffect(() => {
    const stockSimInterval = setInterval(() => {
      // Generate a random price change between -2% and +2%
      const changePercent = (Math.random() * 4 - 2) / 100;
      const newPrice = parseFloat((data.stock.currentPrice * (1 + changePercent)).toFixed(2));
      
      // Update current stock price and history
      setData(prevData => ({
        ...prevData,
        stock: {
          ...prevData.stock,
          currentPrice: newPrice,
          changePercentage: parseFloat(((newPrice / stockHistory[stockHistory.length - 1].price - 1) * 100).toFixed(2))
        }
      }));
      
      // Add to history every ~10 seconds (approximately)
      if (Math.random() > 0.7) {
        const today = new Date();
        setStockHistory(prev => [
          ...prev, 
          { date: today.toISOString().split('T')[0], price: newPrice }
        ]);
      }
    }, 1500); // Update every 1.5 seconds for demonstration
    
    return () => clearInterval(stockSimInterval);
  }, [stockHistory, data.stock.currentPrice]);

  // Calculate investment growth over time
  const investmentChartData = {
    labels: data.investmentHistory.map(inv => inv.round),
    datasets: [
      {
        label: "Investment Amount",
        data: data.investmentHistory.map(inv => inv.amount),
        backgroundColor: ["#3498db", "#2980b9", "#1abc9c"],
        borderColor: "#fff",
        borderWidth: 1
      }
    ]
  };

  useEffect(() => {
    const fetchSocialAnalysis = async () => {
      const response = await getSocialAnalysis(gstNumber);
      setData(prevData => ({
        ...prevData,
        socialAnalysis: response.data 
      }));
    };
    fetchSocialAnalysis();
  }, [gstNumber]);
  

  // Loan comparison chart
  const loanChartData = {
    labels: data.loanHistory.map(loan => loan.bank),
    datasets: [
      {
        label: "Loan Amount",
        data: data.loanHistory.map(loan => loan.amount),
        backgroundColor: data.loanHistory.map(loan => 
          loan.status === "Paid" ? "#27ae60" : "#e74c3c"
        )
      },
      {
        label: "Interest Rate (%)",
        data: data.loanHistory.map(loan => loan.interestRate * 10000), // Scale up for visibility
        backgroundColor: "#f39c12"
      }
    ]
  };

  // Transaction flow chart
  const transactionDates = [...new Set(data.transactionHistory.map(tx => tx.date))].sort();
  
  const transactionFlowData = {
    labels: transactionDates,
    datasets: [
      {
        label: "Credits",
        data: transactionDates.map(date => {
          const credits = data.transactionHistory
            .filter(tx => tx.date === date && tx.type === "Credit")
            .reduce((sum, tx) => sum + tx.amount, 0);
          return credits;
        }),
        backgroundColor: "rgba(46, 204, 113, 0.5)",
        borderColor: "#2ecc71",
        borderWidth: 2,
        tension: 0.4
      },
      {
        label: "Debits",
        data: transactionDates.map(date => {
          const debits = data.transactionHistory
            .filter(tx => tx.date === date && tx.type === "Debit")
            .reduce((sum, tx) => sum + tx.amount, 0);
          return debits;
        }),
        backgroundColor: "rgba(231, 76, 60, 0.5)",
        borderColor: "#e74c3c",
        borderWidth: 2,
        tension: 0.4
      }
    ]
  };

  // Stock price chart
  const stockChartData = {
    labels: stockHistory.map(item => item.date.slice(5)),
    datasets: [
      {
        label: "Stock Price (₹)",
        data: stockHistory.map(item => item.price),
        fill: true,
        backgroundColor: "rgba(52, 152, 219, 0.2)",
        borderColor: "#3498db",
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "#2c3e50"
      }
    ]
  };

  // Sentiment analysis donut chart
  const sentimentChartData = {
    labels: Object.keys(data.sentimentAnalysis),
    datasets: [
      {
        data: Object.values(data.sentimentAnalysis).map(val => val * 100),
        backgroundColor: [
          "#3498db", // LinkedIn - Blue
          "#1da1f2", // Twitter - Light Blue
          "#ea4c89", // Glassdoor - Pink
          "#ff4500", // Reddit - Orange-Red
          "#34495e"  // News - Dark Blue
        ],
        borderColor: "#1f2937",
        borderWidth: 2
      }
    ]
  };

  // Update data with business details if available
  useEffect(() => {
    if (businessDetails) {
      setData(prevData => ({
        ...prevData,
        financialHealth: businessDetails.financialHealth || prevData.financialHealth,
        creditUtilization: businessDetails.creditUtilization || prevData.creditUtilization,
        industryRisk: businessDetails.industryRisk || prevData.industryRisk,
        bankTransactions: businessDetails.bankTransactions || prevData.bankTransactions
      }));
    }
  }, [businessDetails]);

  // Function to determine sentiment status text and color
  const getSentimentStatus = (value) => {
    if (value <= 0.25) return { text: "Negative", color: "#e74c3c" };
    if (value <= 0.5) return { text: "Neutral", color: "#f39c12" };
    if (value <= 0.75) return { text: "Positive", color: "#2ecc71" };
    return { text: "Very Positive", color: "#27ae60" };
  };
  
  // Function to get color for gauge based on value
  const getGaugeColor = (value, isRiskFactor = false) => {
    if (isRiskFactor) {
      // Risk factor: higher is worse
      if (value > 70) return "#e74c3c"; // Red for high risk
      if (value > 40) return "#f39c12"; // Yellow for medium risk
      return "#2ecc71"; // Green for low risk
    } else {
      // Credit score: higher is better
      const normalizedValue = value / 900; // Max credit score is 900
      if (normalizedValue > 0.7) return "#2ecc71"; // Green for good score
      if (normalizedValue > 0.5) return "#f39c12"; // Yellow for medium score
      return "#e74c3c"; // Red for low score
    }
  };

  // Speedometer Gauge Component
  const SpeedometerGauge = ({ value, maxValue, title, isRiskFactor = false }) => {
    // Convert value to angle (0 to 180 degrees)
    const angle = (value / maxValue) * 180;
    const color = getGaugeColor(value, isRiskFactor);
    
    // Create tick marks
    const ticks = [];
    const numTicks = 9; // Number of tick marks
    
    for (let i = 0; i <= numTicks; i++) {
      const tickAngle = (i / numTicks) * 180;
      // Convert angle to radians and calculate position
      const radians = (tickAngle - 90) * (Math.PI / 180);
      const outerRadius = 85;
      const innerRadius = i % 2 === 0 ? 75 : 80; // Major ticks are longer
      
      const x1 = 100 + innerRadius * Math.cos(radians);
      const y1 = 100 + innerRadius * Math.sin(radians);
      const x2 = 100 + outerRadius * Math.cos(radians);
      const y2 = 100 + outerRadius * Math.sin(radians);
      
      ticks.push(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#cbd5e1" strokeWidth="2" />
      );
      
      // Add labels for major ticks
      if (i % 2 === 0) {
        const labelRadius = 65;
        const x = 100 + labelRadius * Math.cos(radians);
        const y = 100 + labelRadius * Math.sin(radians);
        const labelValue = Math.round((i / numTicks) * maxValue);
        
        ticks.push(
          <text 
            key={`label-${i}`} 
            x={x} 
            y={y} 
            fill="#cbd5e1" 
            fontSize="10" 
            textAnchor="middle" 
            dominantBaseline="middle"
          >
            {labelValue}
          </text>
        );
      }
    }
    
    // Convert angle for needle (from -90 to +90 degrees)
    const needleAngle = angle - 90;
    
    return (
      <div className="flex flex-col items-center">
        <svg width="200" height="120" viewBox="0 0 200 120">
          {/* Outer arc - background */}
          <path 
            d="M 30,100 A 70,70 0 0,1 170,100" 
            fill="none" 
            stroke="#1f2937" 
            strokeWidth="20" 
            strokeLinecap="round" 
          />
          
          {/* Color gradient arcs based on ranges */}
          {isRiskFactor ? (
            // Risk factor gauge (green to yellow to red)
            <>
              <path 
                d="M 30,100 A 70,70 0 0,1 83.33,41.37" 
                fill="none" 
                stroke="#2ecc71" 
                strokeWidth="20" 
                strokeLinecap="round" 
              />
              <path 
                d="M 83.33,41.37 A 70,70 0 0,1 116.67,41.37" 
                fill="none" 
                stroke="#f39c12" 
                strokeWidth="20" 
                strokeLinecap="round" 
              />
              <path 
                d="M 116.67,41.37 A 70,70 0 0,1 170,100" 
                fill="none" 
                stroke="#e74c3c" 
                strokeWidth="20" 
                strokeLinecap="round" 
              />
            </>
          ) : (
            // Credit score gauge (red to yellow to green)
            <>
              <path 
                d="M 30,100 A 70,70 0 0,1 83.33,41.37" 
                fill="none" 
                stroke="#e74c3c" 
                strokeWidth="20" 
                strokeLinecap="round" 
              />
              <path 
                d="M 83.33,41.37 A 70,70 0 0,1 116.67,41.37" 
                fill="none" 
                stroke="#f39c12" 
                strokeWidth="20" 
                strokeLinecap="round" 
              />
              <path 
                d="M 116.67,41.37 A 70,70 0 0,1 170,100" 
                fill="none" 
                stroke="#2ecc71" 
                strokeWidth="20" 
                strokeLinecap="round" 
              />
            </>
          )}
          
          {/* Tick marks */}
          {ticks}
          
          {/* Center point for needle */}
          <circle cx="100" cy="100" r="8" fill="#2c3e50" />
          
          {/* Needle */}
          <line 
            x1="100" 
            y1="100" 
            x2="100" 
            y2="40" 
            stroke="#ecf0f1" 
            strokeWidth="3" 
            transform={`rotate(${needleAngle}, 100, 100)`} 
            strokeLinecap="round" 
          />
          
          {/* Needle center cap */}
          <circle cx="100" cy="100" r="4" fill="#ecf0f1" />
        </svg>
        
        {/* Value display */}
        <div className="text-2xl font-bold mt-2">
          {value}{isRiskFactor ? '%' : ''}
        </div>
        <div className="text-gray-400 text-sm">
          {title}
        </div>
      </div>
    );
  };

  const postCreditData = async () => {
    const data = {
      user_id: 1, // Replace with actual user ID
      gst_in: data.gstin, // Assuming gstin is the GST number
      annual_revenue: 1000000, // Replace with actual data
      loan_amount: 50000, // Replace with actual data
      gst_compliance: 95, // Replace with actual data
      past_defaults: 0, // Replace with actual data
      bank_transactions: data.bankTransactions, // Replace with actual data
      market_trend: 1, // Replace with actual data
      credit_score: data.creditScore, // Assuming creditScore is available
      financial_health: data.financialHealth, // Replace with actual data
      repayment_history: 90, // Replace with actual data
      credit_utilization: data.creditUtilization, // Replace with actual data
      industry_risk: data.industryRisk // Replace with actual data
    };

    try {
      const response = await axios.post('http://localhost:5000/post_credit_data', data);
      console.log('Data stored successfully:', response.data);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header Section with sticky navigation */}
      <div className="sticky top-0 z-40 bg-gray-900 border-b border-gray-800 shadow-lg">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <div className="mr-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {data.companyName}
              </h1>
              <p className="text-gray-400 text-sm">GSTIN: {data.gstin}</p>
            </div>
            <div className="hidden md:flex items-center space-x-1 bg-gray-800 px-3 py-1 rounded-full">
              <span className={`h-2 w-2 rounded-full ${data.creditScore > 700 ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              <span className="text-sm font-medium">Active</span>
            </div>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0 space-x-4">
            {creditScore && (
              <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 px-4 py-2 rounded-lg text-sm flex items-center">
                <span className="text-gray-300 mr-2">Credit Score:</span>
                <span className="font-bold text-lg">{creditScore}</span>
              </div>
            )}
            <div className="bg-gray-800 px-4 py-2 rounded-lg flex items-center">
              <div className="mr-3">
                <div className="text-xs text-gray-400">Stock Price</div>
                <div className="text-lg font-bold">₹{data.stock.currentPrice}</div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs ${data.stock.changePercentage >= 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                {data.stock.changePercentage >= 0 ? '↑' : '↓'} {Math.abs(data.stock.changePercentage)}%
              </div>
            </div>
            
            <button 
              onClick={downloadReport}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              {/* analysis logo */}
              
              <span className="hidden md:inline">BenfordLaw Analysis</span>
            </button>
            
            <button 
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              disabled={isLoadingChat}
            >
              <BiMessageRoundedDetail className="mr-2" />
              <span className="hidden md:inline" onClick={(e) => {
                e.stopPropagation(); // Prevent the parent onClick from firing
                handleStartChat();
              }}>
                {isLoadingChat ? 'Loading...' : 'AI Consultant'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Risk Assessment Summary */}
        <RiskAssessmentCard score={creditScore || data.creditScore} factor={data.riskFactor} />
        
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          
          {/* Credit Score & Risk Factor Gauges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg col-span-full md:col-span-2"
          >
            <h2 className="text-xl font-semibold mb-6 border-b border-gray-700 pb-2">Financial Health Indicators</h2>
            <div className="flex flex-wrap justify-around items-center">
              <div className="mb-6 md:mb-0">
                <SpeedometerGauge 
                  value={creditScore || data.creditScore} 
                  maxValue={900} 
                  title="Credit Score" 
                  isRiskFactor={false} 
                />
              </div>
              
              <div>
                <SpeedometerGauge 
                  value={data.riskFactor} 
                  maxValue={100} 
                  title="Risk Factor" 
                  isRiskFactor={true} 
                />
              </div>
            </div>
          </motion.div>

          {/* Sentiment Analysis */}
          <div className="bg-gray-800 p-4 rounded-lg row-span-2">
            <h2 className="text-xl font-semibold mb-4">Market Acceptance</h2>
            <div className="h-64">
              <Doughnut data={sentimentChartData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: { color: '#cbd5e1' }
                  }
                }
              }} />
            </div>
            <div className="mt-4 space-y-2">
              {Object.entries(data.sentimentAnalysis).map(([platform, value]) => {
                const status = getSentimentStatus(value);
                return (
                  <div key={platform} className="flex items-center justify-between">
                    <span>{platform}</span>
                    <span style={{ color: status.color }}>{status.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Investment History */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Investment Rounds</h2>
            <div className="h-64">
              <Doughnut data={investmentChartData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: { color: '#cbd5e1' }
                  }
                }
              }} />
            </div>
          </div>

          {/* Cash Flow */}
          <CashFlowChart />

          {/* Loan History */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Loan History</h2>
            <div className="h-64">
              <Bar data={loanChartData} options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#cbd5e1' }
                  },
                  x: {
                    grid: { display: false },
                    ticks: { color: '#cbd5e1' }
                  }
                },
                plugins: {
                  legend: {
                    position: 'top',
                    labels: { color: '#cbd5e1' }
                  }
                }
              }} />
            </div>
          </div>

          {/* Transaction History */}
          <Transactions transactionHistory={sampleTransactions}/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;