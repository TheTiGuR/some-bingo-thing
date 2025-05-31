import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, BookOpen, Share2, Printer, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/auth/AuthModal';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 animate-fadeIn">
                Create Custom Bingo Boards in Minutes
              </h1>
              <p className="text-lg md:text-xl text-purple-100 mb-8 animate-fadeIn animation-delay-200">
                Design, manage, and share beautiful bingo boards with your own images and content. Perfect for games, education, team building, and more.
              </p>
              <div className="flex flex-wrap gap-4 animate-fadeIn animation-delay-400">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="px-6 py-3 bg-white text-purple-700 rounded-lg font-medium shadow-md hover:bg-gray-100 transition-colors"
                    >
                      My Dashboard
                    </Link>
                    <Link
                      to="/board/new"
                      className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium shadow-md hover:bg-purple-600 transition-colors"
                    >
                      Create New Board
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="px-6 py-3 bg-white text-purple-700 rounded-lg font-medium shadow-md hover:bg-gray-100 transition-colors"
                    >
                      Get Started
                    </button>
                    <Link
                      to="/example"
                      className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium shadow-md hover:bg-purple-600 transition-colors"
                    >
                      See Examples
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
              <div className="relative w-80 h-80 animate-float">
                <div className="absolute inset-0 bg-white rounded-lg shadow-xl transform rotate-6"></div>
                <div className="absolute inset-0 bg-purple-200 rounded-lg shadow-xl transform -rotate-3"></div>
                <div className="absolute inset-0 bg-white rounded-lg shadow-xl flex items-center justify-center">
                  <Grid className="h-32 w-32 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose BingoCreator?</h2>
            <p className="mt-4 text-xl text-gray-600">Create professional bingo boards with powerful features</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Customization</h3>
              <p className="text-gray-600">
                Customize every aspect of your bingo boards, from colors to images, with our intuitive editor.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Share2 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Sharing</h3>
              <p className="text-gray-600">
                Share your bingo boards with friends, family, or colleagues with a simple link or QR code.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Printer className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Multiple Export Options</h3>
              <p className="text-gray-600">
                Print your boards, save them as images, or generate QR codes for easy distribution.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600">Create your custom bingo board in three simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Design Your Board</h3>
              <p className="text-gray-600">
                Choose a color scheme, upload images for header, footer, and center square.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Add Your Content</h3>
              <p className="text-gray-600">
                Fill in your bingo squares with custom text, rearrange them, or randomize the order.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Share & Play</h3>
              <p className="text-gray-600">
                Export your board as PDF or image, share via link or QR code, and start playing!
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">What Our Users Say</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold">
                  J
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900">Jane Smith</h4>
                  <p className="text-sm text-gray-500">Teacher</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I use BingoCreator for my classroom activities. The students love the colorful designs and it makes learning fun!"
              </p>
              <div className="mt-3 flex text-yellow-400">
                <CheckCircle2 className="h-5 w-5" />
                <CheckCircle2 className="h-5 w-5" />
                <CheckCircle2 className="h-5 w-5" />
                <CheckCircle2 className="h-5 w-5" />
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
                  M
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900">Mark Johnson</h4>
                  <p className="text-sm text-gray-500">Event Planner</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The custom bingo boards were a hit at our company retreat. Easy to create and the QR code sharing feature saved us time!"
              </p>
              <div className="mt-3 flex text-yellow-400">
                <CheckCircle2 className="h-5 w-5" />
                <CheckCircle2 className="h-5 w-5" />
                <CheckCircle2 className="h-5 w-5" />
                <CheckCircle2 className="h-5 w-5" />
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold">
                  S
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900">Sarah Williams</h4>
                  <p className="text-sm text-gray-500">Parent</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Made custom bingo boards for my daughter's birthday party. The kids loved seeing their favorite characters in the center square!"
              </p>
              <div className="mt-3 flex text-yellow-400">
                <CheckCircle2 className="h-5 w-5" />
                <CheckCircle2 className="h-5 w-5" />
                <CheckCircle2 className="h-5 w-5" />
                <CheckCircle2 className="h-5 w-5" />
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Own Bingo Boards?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Join thousands of users who have created fun, engaging, and beautiful bingo boards for every occasion.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {user ? (
              <Link
                to="/board/new"
                className="px-6 py-3 bg-white text-purple-700 rounded-lg font-medium shadow-md hover:bg-gray-100 transition-colors"
              >
                Create Your First Board
              </Link>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-6 py-3 bg-white text-purple-700 rounded-lg font-medium shadow-md hover:bg-gray-100 transition-colors"
              >
                Sign Up for Free
              </button>
            )}
          </div>
        </div>
      </section>
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;