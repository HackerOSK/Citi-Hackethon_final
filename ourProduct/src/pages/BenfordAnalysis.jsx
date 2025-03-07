import React, { useState } from 'react';
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Squares } from '../components/Squares';

// Dark theme CSS for the component
const styles = `
  .benford-container {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
    background-color: #111827;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    border: 1px solid #1f2937;
    color: #e5e7eb;
  }
  
  .benford-title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 24px;
    background: linear-gradient(to right, #3b82f6, #8b5cf6);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
  }
  
  .form-section {
    margin-bottom: 24px;
    background-color: #1f2937;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #374151;
  }
  
  .form-label {
    display: block;
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 500;
    color: #9ca3af;
  }
  
  .textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #374151;
    border-radius: 8px;
    height: 128px;
    background-color: #111827;
    color: #e5e7eb;
    font-family: monospace;
    resize: vertical;
    transition: all 0.3s ease;
  }
  
  .textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }
  
  .button-group {
    display: flex;
    gap: 12px;
    margin-top: 16px;
    flex-wrap: wrap;
  }
  
  .button {
    padding: 10px 16px;
    border-radius: 8px;
    border: none;
    color: white;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .button-primary {
    background: linear-gradient(to right, #3b82f6, #8b5cf6);
  }
  
  .button-primary:hover {
    background: linear-gradient(to right, #2563eb, #7c3aed);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .button-success {
    background: linear-gradient(to right, #10b981, #059669);
  }
  
  .button-success:hover {
    background: linear-gradient(to right, #059669, #047857);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .button-danger {
    background: linear-gradient(to right, #ef4444, #dc2626);
  }
  
  .button-danger:hover {
    background: linear-gradient(to right, #dc2626, #b91c1c);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .results-heading {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #e5e7eb;
    border-bottom: 1px solid #374151;
    padding-bottom: 8px;
  }
  
  .stats-box {
    background-color: #1f2937;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 24px;
    border: 1px solid #374151;
  }
  
  .stats-subheading {
    font-weight: 600;
    margin-bottom: 12px;
    color: #d1d5db;
    font-size: 16px;
  }
  
  .chart-container {
    height: 320px;
    margin-bottom: 24px;
    background-color: #1f2937;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #374151;
  }
  
  .conclusion {
    font-weight: bold;
    padding: 8px 12px;
    border-radius: 6px;
    display: inline-block;
    margin-top: 8px;
  }
  
  .conclusion-safe {
    background-color: rgba(16, 185, 129, 0.2);
    color: #34d399;
    border: 1px solid rgba(16, 185, 129, 0.3);
  }
  
  .conclusion-fraud {
    background-color: rgba(239, 68, 68, 0.2);
    color: #f87171;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }
  
  .table {
    min-width: 100%;
    background-color: #1f2937;
    border: 1px solid #374151;
    border-radius: 8px;
    overflow: hidden;
    border-collapse: collapse;
  }
  
  .table th, .table td {
    padding: 12px 16px;
    border-bottom: 1px solid #374151;
    text-align: center;
  }
  
  .table th {
    background-color: #111827;
    color: #d1d5db;
  }
  
  .table-cell-header {
    font-weight: 600;
    color: #9ca3af;
    text-align: left;
  }
  
  /* Custom tooltip styles */
  .custom-tooltip {
    background-color: #1f2937;
    border: 1px solid #374151;
    border-radius: 6px;
    padding: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .custom-tooltip-label {
    color: #9ca3af;
    margin-bottom: 5px;
  }
  
  .custom-tooltip-value {
    color: #e5e7eb;
    font-weight: 600;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .button-group {
      flex-direction: column;
    }
    
    .button {
      width: 100%;
    }
  }
`;

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="custom-tooltip-label">Digit: {label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="custom-tooltip-value" style={{ color: entry.color }}>
            {entry.name}: {(entry.value * 100).toFixed(2)}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const BenfordAnalysis = () => {
  const [data, setData] = useState([]);
  const [benfordData, setBenfordData] = useState([]);
  const [results, setResults] = useState({});
  const [dataInput, setDataInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Calculate Benford's distribution (theoretical)
  const calculateBenfordDistribution = () => {
    const benfordDistribution = [];
    for (let digit = 1; digit <= 9; digit++) {
      benfordDistribution.push({
        digit,
        expected: Math.log10(1 + 1/digit),
        label: `${digit}`
      });
    }
    return benfordDistribution;
  };
  
  // Extract first digit from a number
  const getFirstDigit = (number) => {
    return parseInt(Math.abs(number).toString()[0]);
  };
  
  // Calculate observed first digit distribution
  const calculateFirstDigitDistribution = (transactions) => {
    const values = transactions.map(item => typeof item === 'object' ? item.amount : item)
      .filter(amount => typeof amount === 'number' && !isNaN(amount) && amount !== 0);
    
    // Get first digits
    const firstDigits = values.map(getFirstDigit);
    
    // Count occurrences of each digit
    const digitCounts = {};
    for (let digit = 1; digit <= 9; digit++) {
      digitCounts[digit] = 0;
    }
    
    firstDigits.forEach(digit => {
      if (digit >= 1 && digit <= 9) {
        digitCounts[digit]++;
      }
    });
    
    // Convert to probabilities
    const total = Object.values(digitCounts).reduce((sum, count) => sum + count, 0);
    const distribution = [];
    
    for (let digit = 1; digit <= 9; digit++) {
      distribution.push({
        digit,
        observed: digitCounts[digit] / total,
        expected: Math.log10(1 + 1/digit),
        label: `${digit}`
      });
    }
    
    return { distribution, total };
  };
  
  // Chi-square test for Benford's Law
  const performChiSquareTest = (observed, expected, total) => {
    let chiSquare = 0;
    
    for (let i = 0; i < observed.length; i++) {
      const observedCount = observed[i] * total;
      const expectedCount = expected[i] * total;
      chiSquare += Math.pow(observedCount - expectedCount, 2) / expectedCount;
    }
    
    // Approximate p-value calculation (simplified for this component)
    // 8 degrees of freedom for Benford's Law (9 digits - 1)
    const pValue = estimatePValue(chiSquare, 8);
    
    return {
      chiSquare,
      pValue,
      significant: pValue < 0.05
    };
  };
  
  // Very simplified p-value estimator (not for production use)
  const estimatePValue = (chiSquare, df) => {
    // This is a very rough approximation
    if (chiSquare < df) return 0.5;
    const z = (chiSquare - df) / Math.sqrt(2 * df);
    return 1 - (0.5 + 0.5 * Math.tanh(z * 0.7));
  };
  
  // Process data and run analysis
  const analyzeData = (inputData) => {
    setIsAnalyzing(true);
    
    try {
      let transactions = [];
      
      if (typeof inputData === 'string') {
        transactions = JSON.parse(inputData);
      } else {
        transactions = inputData;
      }
      
      // Set benford distribution
      const benfordDistribution = calculateBenfordDistribution();
      setBenfordData(benfordDistribution);
      
      // Calculate observed distribution
      const { distribution, total } = calculateFirstDigitDistribution(transactions);
      
      // Extract observed and expected probabilities for chi-square test
      const observed = distribution.map(item => item.observed);
      const expected = distribution.map(item => item.expected);
      
      // Perform chi-square test
      const testResults = performChiSquareTest(observed, expected, total);
      
      setData(distribution);
      setResults({
        chiSquare: testResults.chiSquare.toFixed(2),
        pValue: testResults.pValue.toFixed(4),
        significant: testResults.significant,
        conclusion: testResults.significant 
          ? "Significant deviation from Benford's Law (potential anomaly detected)."
          : "No significant deviation from Benford's Law."
      });
      
    } catch (error) {
      console.error("Error analyzing data:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Handle sample data selection
  const handleSampleData = (type) => {
    if (type === 'clean') {
      const cleanData = generateCleanData();
      setDataInput(JSON.stringify(cleanData));
      analyzeData(cleanData);
    } else if (type === 'fraud') {
      const fraudData = generateFraudData();
      setDataInput(JSON.stringify(fraudData));
      analyzeData(fraudData);
    }
  };
  
  // Generate sample clean data
  const generateCleanData = () => {
    const data = [];
    for (let i = 0; i < 200; i++) {
      data.push(Math.floor(Math.random() * 9000) + 1000);
    }
    return data;
  };
  
  // Generate sample fraud data
  const generateFraudData = () => {
    const data = [];
    for (let i = 0; i < 200; i++) {
      // Generate values starting with 5 or 6 more frequently
      const firstDigit = Math.random() < 0.7 ? (Math.random() < 0.5 ? 5 : 6) : Math.floor(Math.random() * 9) + 1;
      const restOfNumber = Math.floor(Math.random() * 9000) + 1000;
      data.push(parseInt(`${firstDigit}${restOfNumber}`));
    }
    return data;
  };
  
  // Handle submit
  const handleAnalyze = () => {
    analyzeData(dataInput);
  };

  return (
    <Squares 
      speed={0.2} 
      squareSize={50}
      direction='diagonal'
      borderColor='rgba(59, 130, 246, 0.3)'
      hoverFillColor='rgba(139, 92, 246, 0.1)'
    >
      <div className="min-h-screen bg-black/90 text-white overflow-hidden py-10">
        <style>{styles}</style>
        <motion.div 
          className="benford-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="benford-title">Benford's Law Analysis</h1>
          
          <motion.div 
            className="form-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Transaction Data (JSON array of numbers)</label>
              <textarea 
                className="textarea"
                value={dataInput}
                onChange={(e) => setDataInput(e.target.value)}
                placeholder='[1234, 5678, 9012, 3456, ...]'
              />
            </div>
            
            <div className="button-group">
              <button 
                onClick={handleAnalyze}
                className="button button-primary"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Data'}
              </button>
              <button 
                onClick={() => handleSampleData('clean')}
                className="button button-success"
                disabled={isAnalyzing}
              >
                Load Clean Sample
              </button>
              <button 
                onClick={() => handleSampleData('fraud')}
                className="button button-danger"
                disabled={isAnalyzing}
              >
                Load Fraudulent Sample
              </button>
            </div>
          </motion.div>
          
          {data.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div style={{ marginBottom: '32px' }}>
                <h2 className="results-heading">Benford's Law Analysis Results</h2>
                
                <div className="stats-box">
                  <h3 className="stats-subheading">Statistical Results:</h3>
                  <p>Chi-square Statistic: <span style={{ color: '#d1d5db', fontWeight: 600 }}>{results.chiSquare}</span></p>
                  <p>P-value: <span style={{ color: '#d1d5db', fontWeight: 600 }}>{results.pValue}</span></p>
                  <div className={results.significant ? "conclusion conclusion-fraud" : "conclusion conclusion-safe"}>
                    {results.conclusion}
                  </div>
                </div>
                
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="label" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="observed" name="Observed Distribution" fill="#8b5cf6" />
                      <Bar dataKey="expected" name="Benford's Law (Expected)" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="label" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line type="monotone" dataKey="observed" name="Observed Distribution" stroke="#8b5cf6" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="expected" name="Benford's Law (Expected)" stroke="#3b82f6" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>First Digit</th>
                      {data.map(item => (
                        <th key={item.digit}>{item.digit}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="table-cell-header">Expected (%)</td>
                      {data.map(item => (
                        <td key={item.digit}>{(item.expected * 100).toFixed(1)}%</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="table-cell-header">Observed (%)</td>
                      {data.map(item => (
                        <td key={item.digit}>{(item.observed * 100).toFixed(1)}%</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </Squares>
  );
};

export default BenfordAnalysis;