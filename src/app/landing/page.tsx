"use client";
import React from "react";
import Link from "next/link";
import { 
  Play, 
  Users, 
  Heart, 
  ChatCircle as MessageCircle, 
  Star, 
  ArrowRight,
  FilmStrip as Film,
  ChatCentered,
  VideoCamera
} from "phosphor-react";
import { useAuth } from "@/app/context/AuthContext";

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Film size={48} />,
      title: "Discover Movies & Series",
      description: "Explore an extensive library of movies and TV series with detailed information, ratings, and reviews."
    },
    {
      icon: <MessageCircle size={48} />,
      title: "Real-time Discussions",
      description: "Join live conversations about the latest releases, trending shows, and timeless classics."
    },
    {
      icon: <VideoCamera size={48} />,
      title: "Movie Clips & Snippets",
      description: "Watch and discuss specific scenes, trailers, and memorable moments from your favorite content."
    },
    {
      icon: <Heart size={48} />,
      title: "Personal Collections",
      description: "Create custom lists, save favorites, and keep track of what you want to watch next."
    },
    {
      icon: <Users size={48} />,
      title: "Connect with Cinephiles",
      description: "Build your network of movie enthusiasts and share your passion for cinema."
    },
    {
      icon: <ChatCentered size={48} />,
      title: "Private & Global Chat",
      description: "Engage in both intimate conversations with friends and join the global movie community."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Film Student",
      content: "Sinemo has transformed how I discover and discuss films. The real-time chat feature during movie releases is incredible!",
      avatar: "SC"
    },
    {
      name: "Michael Rodriguez",
      role: "Movie Enthusiast",
      content: "Finally, a platform that combines social networking with serious film discussion. The clip sharing feature is genius.",
      avatar: "MR"
    },
    {
      name: "Emma Thompson",
      role: "Film Critic",
      content: "The community here is amazing. I've found so many hidden gems through the recommendations and discussions.",
      avatar: "ET"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Film size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Sinemo</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link 
                href="/"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium"
              >
                Go to App
              </Link>
            ) : (
              <>
                <Link 
                  href="/views/auth/signin"
                  className="px-6 py-2 text-white hover:text-purple-200 transition-colors duration-300"
                >
                  Sign In
                </Link>
                <Link 
                  href="/views/auth/signup"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Where Cinema
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}Comes Alive
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join the ultimate community for movie lovers. Discover, discuss, and dive deep into 
              the world of cinema with real-time conversations and exclusive content.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            {!isAuthenticated && (
              <Link 
                href="/views/auth/signup"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold text-lg flex items-center gap-2 group"
              >
                Start Your Journey
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            )}
            <button className="px-8 py-4 border-2 border-white/20 text-white rounded-lg hover:border-white/40 transition-all duration-300 font-semibold text-lg flex items-center gap-2 group">
              <Play size={20} className="group-hover:scale-110 transition-transform duration-300" />
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">1M+</div>
              <div className="text-gray-400">Movies Discussed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">Live Conversations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need for
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}Movie Magic
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From discovering hidden gems to engaging in heated debates about plot twists, 
              Sinemo has all the tools you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Loved by 
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}Cinema Enthusiasts
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              See what our community of movie lovers has to say about their Sinemo experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed italic">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex text-yellow-400 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} weight="fill" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Join the 
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}Conversation?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Start discovering, discussing, and connecting with fellow movie enthusiasts today. 
            Your next favorite film is just a conversation away.
          </p>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/views/auth/signup"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-2 group"
              >
                Create Free Account
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link 
                href="/views/auth/signin"
                className="px-8 py-4 border-2 border-white/20 text-white rounded-lg hover:border-white/40 transition-all duration-300 font-semibold text-lg"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Film size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">Sinemo</span>
            </div>
            
            <div className="text-gray-400 text-center md:text-right">
              <p>&copy; 2025 Sinemo. All rights reserved.</p>
              <p className="text-sm mt-1">Where Cinema Comes Alive</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
