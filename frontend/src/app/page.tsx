'use client';

import Link from 'next/link';
import { MessageCircle, Zap, Shield, Scale, Users, MessageSquare, Send, Phone, Mail, MapPin, ArrowRight, Check, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">ChatMessaging</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 font-medium">FAQ</a>
            </nav>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 font-medium hidden sm:block"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Now with AI-powered responses
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Real-time Chat for
                <span className="text-blue-600"> Modern Apps</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                A production-grade chat platform with secure authentication, 
                real-time messaging, and scalable architecture built for millions of users.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#features"
                  className="bg-white text-gray-700 border border-gray-300 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
                >
                  Explore Features
                </a>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">50K+</div>
                <div className="text-gray-400">Active Users</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">10M+</div>
                <div className="text-gray-400">Messages Daily</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">99.9%</div>
                <div className="text-gray-400">Uptime SLA</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">150+</div>
                <div className="text-gray-400">Countries</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Build powerful chat experiences with our comprehensive feature set
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Real-time Messaging
                </h3>
                <p className="text-gray-600">
                  Powered by Socket.IO with Redis adapter for horizontal scaling. Sub-100ms message delivery worldwide.
                </p>
              </div>
              <div className="p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Enterprise Security
                </h3>
                <p className="text-gray-600">
                  End-to-end encryption, SSO integration, and compliance with SOC 2, GDPR, and HIPAA.
                </p>
              </div>
              <div className="p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Scale className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Scalable Architecture
                </h3>
                <p className="text-gray-600">
                  Clean architecture with domain-driven design. Scale from 100 to 100 million users effortlessly.
                </p>
              </div>
              <div className="p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Presence System
                </h3>
                <p className="text-gray-600">
                  Real-time online/offline status, typing indicators, and read receipts for complete conversation context.
                </p>
              </div>
              <div className="p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                  <MessageSquare className="w-7 h-7 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Rich Media Support
                </h3>
                <p className="text-gray-600">
                  Images, videos, files, and voice messages with automatic optimization and CDN delivery.
                </p>
              </div>
              <div className="p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                  <Send className="w-7 h-7 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Webhooks & API
                </h3>
                <p className="text-gray-600">
                  Complete REST and WebSocket APIs with webhooks for easy integration into your existing stack.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Get started in minutes with our simple integration process
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Account</h3>
                <p className="text-gray-600">Sign up for free and get your API keys</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Integrate SDK</h3>
                <p className="text-gray-600">Add our client SDK to your app</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Configure</h3>
                <p className="text-gray-600">Set up channels and users</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Go Live</h3>
                <p className="text-gray-600">Launch and start chatting</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose the plan that fits your needs. Scale as you grow.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="p-8 rounded-2xl border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
                <p className="text-gray-600 mb-4">Perfect for side projects</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-green-500" /> 1,000 messages/month
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-green-500" /> 2 users
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-green-500" /> Basic support
                  </li>
                </ul>
                <Link
                  href="/register"
                  className="block w-full py-3 text-center border-2 border-gray-300 rounded-lg font-medium hover:border-blue-600 hover:text-blue-600 transition-colors"
                >
                  Get Started
                </Link>
              </div>
              {/* Pro Plan */}
              <div className="p-8 rounded-2xl border-2 border-blue-600 relative">
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  Popular
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Professional</h3>
                <p className="text-gray-600 mb-4">For growing businesses</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$49</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-green-500" /> Unlimited messages
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-green-500" /> 50 users
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-green-500" /> Priority support
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-green-500" /> Analytics
                  </li>
                </ul>
                <Link
                  href="/register"
                  className="block w-full py-3 text-center bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Start Free Trial
                </Link>
              </div>
              {/* Enterprise Plan */}
              <div className="p-8 rounded-2xl border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-4">For large organizations</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">Custom</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-green-500" /> Unlimited users
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-green-500" /> Dedicated infrastructure
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-green-500" /> 24/7 support
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-green-500" /> Custom integrations
                  </li>
                </ul>
                <Link
                  href="/register"
                  className="block w-full py-3 text-center border-2 border-gray-300 rounded-lg font-medium hover:border-blue-600 hover:text-blue-600 transition-colors"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Trusted by Thousands
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                See what our customers have to say
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-800 p-8 rounded-2xl">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">
                  &quot;ChatMessaging transformed how we handle customer support. The real-time functionality is incredible.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    JD
                  </div>
                  <div>
                    <div className="text-white font-medium">John Doe</div>
                    <div className="text-gray-400 text-sm">CTO at TechCorp</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 p-8 rounded-2xl">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">
                  &quot;Best chat solution we&apos;ve used. The API is well-documented and the support team is amazing.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    SM
                  </div>
                  <div>
                    <div className="text-white font-medium">Sarah Miller</div>
                    <div className="text-gray-400 text-sm">Product Lead at StartupX</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 p-8 rounded-2xl">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">
                  &quot;Scaled from 100 to 10M users without any issues. The infrastructure is rock solid.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    MK
                  </div>
                  <div>
                    <div className="text-white font-medium">Mike Kim</div>
                    <div className="text-gray-400 text-sm">VP Engineering at ScaleUp</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How does the real-time messaging work?
                </h3>
                <p className="text-gray-600">
                  We use WebSocket connections powered by Socket.IO with Redis adapter for scaling across multiple servers. Messages are delivered in under 100ms globally.
                </p>
              </div>
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Is my data secure?
                </h3>
                <p className="text-gray-600">
                  Yes. We use end-to-end encryption, comply with SOC 2, GDPR, and HIPAA standards, and never sell your data. All data is encrypted at rest and in transit.
                </p>
              </div>
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I migrate from another chat provider?
                </h3>
                <p className="text-gray-600">
                  Absolutely! We offer migration tools and dedicated support to help you move your conversations, users, and history from any platform.
                </p>
              </div>
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What happens if I exceed my plan limits?
                </h3>
                <p className="text-gray-600">
                  We&apos;ll notify you when you&apos;re approaching your limits. You can upgrade your plan or pay for overages at competitive rates. There&apos;s no service interruption.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of developers building amazing chat experiences.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors inline-flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-white/10 transition-colors"
              >
                Talk to Sales
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-8 h-8 text-blue-500" />
                <span className="text-xl font-bold">ChatMessaging</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-sm">
                The most powerful real-time chat platform for building engaging communication experiences.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-2-5.318-4.5-5.318-1.5 0-2.5 1.115-2.5 2.5v5.422h-3v-11h3v1.638c.678-1.043 2.115-2.138 4.5-2.138 1.5 0 2.5.783 2.5 2.5v5.962z" clipRule="evenodd"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Press Kit</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} ChatMessaging. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" /> support@chatmessaging.com
                </a>
                <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-4 h-4" /> 1-800-CHAT-API
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
