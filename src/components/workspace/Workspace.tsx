import React from 'react'
import { BarChart3, Globe, Zap, Shield, Search, TrendingUp } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export function Workspace() {
  const { profile } = useAuth()

  const features = [
    {
      icon: BarChart3,
      title: 'Performance Analysis',
      description: 'Comprehensive website performance metrics and insights',
      color: 'bg-blue-500'
    },
    {
      icon: Zap,
      title: 'Speed Optimization',
      description: 'Identify and fix performance bottlenecks',
      color: 'bg-yellow-500'
    },
    {
      icon: Shield,
      title: 'Security Audit',
      description: 'Check for security vulnerabilities and best practices',
      color: 'bg-green-500'
    },
    {
      icon: Search,
      title: 'SEO Analysis',
      description: 'Optimize your website for search engines',
      color: 'bg-purple-500'
    },
    {
      icon: Globe,
      title: 'Accessibility Check',
      description: 'Ensure your website is accessible to everyone',
      color: 'bg-indigo-500'
    },
    {
      icon: TrendingUp,
      title: 'Performance Tracking',
      description: 'Monitor your website performance over time',
      color: 'bg-pink-500'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {profile?.full_name || 'User'}! 👋
        </h1>
        <p className="text-gray-600">
          Ready to analyze your website's performance? Choose a tool below to get started.
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 mb-8 text-white">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Website Performance Analyzer</h2>
          <p className="text-blue-100 mb-6">
            Get comprehensive insights into your website's performance, SEO, accessibility, and more using Google Lighthouse technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="url"
              placeholder="Enter website URL (e.g., https://example.com)"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Analyze Website
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-12 bg-gray-50 rounded-xl p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Analysis</h3>
        <div className="text-center py-12">
          <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No recent analysis found</p>
          <p className="text-sm text-gray-400 mt-2">
            Start by analyzing your first website above
          </p>
        </div>
      </div>
    </div>
  )
}