import React, { useEffect, useRef } from 'react';
import { 
  BiBarChartAlt2 as BarChart3,
  BiUpload as Upload,
  BiLineChart as LineChart,
  BiPieChartAlt as PieChart
} from 'react-icons/bi';
import { BiTime as Clock } from 'react-icons/bi';
import { BiShield as ShieldCheck } from 'react-icons/bi';
import { BiRightArrowAlt as ArrowRight } from 'react-icons/bi';
// Import animation libraries
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Mock components to replace shadcn components
const Button = ({ children, variant, className, size, ...props }) => {
  return (
    <button 
      className={`px-4 py-2 rounded ${
        variant === 'outline' 
          ? 'border border-gray-700 text-white hover:bg-gray-800' 
          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
      } ${size === 'lg' ? 'text-lg px-6 py-3' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className, ...props }) => {
  return (
    <input 
      className={`w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white ${className}`}
      {...props}
    />
  );
};

const Select = ({ children }) => {
  return children;
};

const Checkbox = ({ id }) => {
  return <input type="checkbox" id={id} className="h-4 w-4 rounded border-gray-700" />;
};

// Dialog components
const Dialog = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  
  return React.Children.map(children, child => {
    if (child.type === DialogTrigger) {
      return React.cloneElement(child, { onClick: () => setOpen(true) });
    }
    if (child.type === DialogContent) {
      return open ? React.cloneElement(child, { onClose: () => setOpen(false) }) : null;
    }
    return child;
  });
};

const DialogTrigger = ({ asChild, children, onClick }) => {
  return React.cloneElement(children, { onClick });
};

const DialogContent = ({ children, onClose, className }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`sm:max-w-[600px] bg-gray-900 border-gray-800 rounded-lg p-6 ${className}`}>
        <button 
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const DialogHeader = ({ children }) => <div className="mb-4">{children}</div>;
const DialogTitle = ({ children, className }) => <h2 className={`text-2xl font-bold text-white ${className}`}>{children}</h2>;

// Icons (simplified)
const IconWrapper = ({ children }) => <span className="inline-block">{children}</span>;

// const BarChart3 = () => <IconWrapper>📊</IconWrapper>;
// const Clock = () => <IconWrapper>⏰</IconWrapper>;
// const ShieldCheck = () => <IconWrapper>🛡️</IconWrapper>;
// const ArrowRight = () => <IconWrapper>→</IconWrapper>;
// const Upload = () => <IconWrapper>⬆️</IconWrapper>;
// const LineChart = () => <IconWrapper>📈</IconWrapper>;
// const PieChart = () => <IconWrapper>🔄</IconWrapper>;

function App() {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7; // Slow down video for better background effect
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Video Background */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          className="absolute w-full h-full object-cover opacity-30"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-lines-forming-a-human-face-70-large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/80"></div>
      </div>

      {/* Content Container with z-index to appear above video */}
      <div className="relative z-10">
        {/* Navigation */}
        <header className="container mx-auto py-6 flex items-center justify-between backdrop-blur-sm">
          <div className="flex items-center gap-10">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              CreditAI
            </h1>
            <nav className="hidden md:flex gap-8">
              <a href="#" className="text-white/80 hover:text-white transition">
                Home
              </a>
              <a href="#" className="text-white/80 hover:text-white transition">
                Features
              </a>
              <a href="#" className="text-white/80 hover:text-white transition">
                About
              </a>
              <a href="#" className="text-white/80 hover:text-white transition">
                Resources
              </a>
            </nav>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
              Login
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Sign Up
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container h-screen mx-auto py-20 grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold leading-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                AI-Powered
              </span> Credit Scoring for Businesses
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Transform your business financing with our innovative AI-driven credit scoring system. Experience faster
              approvals and smarter risk analysis tailored to your needs.
            </p>
            <div className="flex gap-4">
              
                
                  <Button onClick={() => navigate('/gst-verification')}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Get Started
                  </Button>
                
                
              
              <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                Learn More
              </Button>
            </div>
          </motion.div>
          
          {/* risk video */}
          <motion.div 
            className="relative h-[400px] rounded-xl overflow-hidden bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-1"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm rounded-xl flex items-center justify-center">
              {/* Video container with styling */}
              <div className="relative w-full h-full overflow-hidden rounded-lg">
                {/* Overlay gradient to blend video with dark theme */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-purple-900/80 mix-blend-multiply z-10"></div>
                
                {/* Animated particles on top of video */}
                
                
                {/* The video itself */}
            <video 
                  src="src/assets/risk.mp4" 
              autoPlay 
              muted 
              loop 
                  className="w-full h-full object-cover opacity-80"
                />
                
                {/* Credit score overlay on top of video */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
            <motion.div 
                    className="mb-4 relative"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      duration: 0.8,
                      delay: 0.8,
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    {/* Add a speedometer or other visualization here if needed */}
                    <div className="w-32 h-32 rounded-full border-4 border-white/20 flex items-center justify-center mb-4 backdrop-blur-sm bg-gray-900/40">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400">720</div>
                        <div className="text-xs text-gray-300">Credit Score</div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Data metrics below the score */}
                  <motion.div 
                    className="grid grid-cols-2 gap-4 p-4 bg-gray-800/70 backdrop-blur-md rounded-xl border border-gray-700/50 w-4/5 shadow-lg"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      duration: 0.5,
                      delay: 1.2,
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    <div className="space-y-2">
                      <div className="text-xs text-gray-400">Risk Level</div>
                      <div className="h-2 bg-gradient-to-r from-green-500 to-green-300 rounded-full w-3/4"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs text-gray-400">Approval Rate</div>
                      <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full w-4/5"></div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-black/80 to-gray-900/80 backdrop-blur-sm">
          <div className="container mx-auto text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Unlock the Future of Credit Scoring
            </motion.h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Experience the next level of credit evaluation with our AI-powered system. Our innovative approach ensures
              that businesses receive accurate and timely credit assessments.
            </p>
          </div>

          <div className="container mx-auto grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-gray-900/70 backdrop-blur-md p-8 rounded-xl border border-gray-800 text-center hover:border-blue-500/50 transition duration-300 hover:shadow-lg hover:shadow-blue-500/10 group"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-4">Faster Loan Approvals for Your Business</h3>
              <p className="text-gray-400">See positive in loan waiting times and help to quick financing.</p>
            </motion.div>

            <motion.div 
              className="bg-gray-900/70 backdrop-blur-md p-8 rounded-xl border border-gray-800 text-center hover:border-purple-500/50 transition duration-300 hover:shadow-lg hover:shadow-purple-500/10 group"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-4">Real-Time Credit Scoring at Your Fingertips</h3>
              <p className="text-gray-400">Get instant insights into your creditworthiness.</p>
            </motion.div>

            <motion.div 
              className="bg-gray-900/70 backdrop-blur-md p-8 rounded-xl border border-gray-800 text-center hover:border-green-500/50 transition duration-300 hover:shadow-lg hover:shadow-green-500/10 group"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-4">AI-Driven Risk Analysis for Informed Decisions</h3>
              <p className="text-gray-400">Leverage advanced analytics to minimize risks effectively.</p>
            </motion.div>
          </div>

          <div className="container mx-auto mt-12 text-center">
            <div className="flex gap-4 justify-center">
              <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                Learn More
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Sign Up <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Analytics Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Unlock the Power of Financial Analytics</h2>
              <p className="text-gray-300 mb-8">
                Discover how our AI-driven analytics can transform your credit scoring process. Gain real-time insights
                that empower your business decisions.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <PieChart className="h-6 w-6 text-blue-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Data Visualization</h3>
                  <p className="text-sm text-gray-400">
                    Visualize your financial data with intuitive graphs and scoring metrics.
                  </p>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <LineChart className="h-6 w-6 text-purple-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">AI Insights</h3>
                  <p className="text-sm text-gray-400">
                    Leverage AI technology for smarter financial decisions and risk management.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                  Learn More
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started
                </Button>
              </div>
            </div>

            <div className="relative h-[400px] rounded-xl overflow-hidden bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-1">
              <div className="absolute inset-0 bg-gray-800 rounded-xl flex items-center justify-center">
                <div className="w-4/5 h-4/5 bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-center mb-6">
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-700 rounded-full w-24"></div>
                      <div className="h-3 bg-gray-700 rounded-full w-16"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 w-6 bg-gray-700 rounded"></div>
                      <div className="h-6 w-6 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg"></div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-16 bg-blue-500/20 rounded-lg"></div>
                      <div className="h-16 bg-purple-500/20 rounded-lg"></div>
                      <div className="h-16 bg-green-500/20 rounded-lg"></div>
                    </div>
                    <div className="h-24 bg-gray-800 rounded-lg border border-gray-700"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-black">
          <div className="container mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6">Subscribe to updates</h2>
            <p className="text-gray-400 mb-8">Stay informed about our latest features and offers.</p>

            <div className="flex max-w-md mx-auto gap-2">
              <Input className="bg-gray-900 border-gray-700 text-white" placeholder="Your email here" />
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Join
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-4">By subscribing, you consent to our Privacy Policy.</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 py-12 border-t border-gray-800">
          <div className="container mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
            <div>
              <h3 className="font-medium mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Contact Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4 text-white">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Events
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Feedback
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4 text-white">Follow Us</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    YouTube
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4 text-white">Get in Touch</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Email Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Call Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Live Chat
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Stay Connected
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4 text-white">Company Info</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Our Mission
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Our Team
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Our Values
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Our History
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="container mx-auto mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4 md:mb-0">
              CreditAI
            </div>
            <div className="text-sm text-gray-500">© 2025 CreditAI. All rights reserved.</div>
          </div>
        </footer>
      </div>
      
      {/* Add global animations CSS */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(20px);
          }
          75% {
            transform: translateY(-30px) translateX(-10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
        
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default App;