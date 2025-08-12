import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react'

// Sample blog posts for SEO
const blogPosts = [
  {
    id: 1,
    title: "Everything You Need to Know About MOT Testing in 2025",
    excerpt: "Stay up to date with the latest MOT testing requirements, changes in regulations, and what to expect when taking your vehicle for its annual test.",
    category: "MOT Testing",
    readTime: "5 min read",
    date: "2025-01-15",
    image: "/images/blog/mot-testing-2025.jpg",
    slug: "mot-testing-2025"
  },
  {
    id: 2,
    title: "How to Prepare Your Vehicle for MOT Success",
    excerpt: "Follow our comprehensive checklist to ensure your vehicle passes its MOT test first time. Save money and avoid common failures.",
    category: "Vehicle Maintenance",
    readTime: "7 min read",
    date: "2025-01-10",
    image: "/images/blog/vehicle-preparation.jpg",
    slug: "vehicle-preparation-mot"
  },
  {
    id: 3,
    title: "Common MOT Failures and How to Avoid Them",
    excerpt: "Discover the most frequent reasons vehicles fail MOT tests and learn practical tips to prevent these issues before your test date.",
    category: "MOT Failures",
    readTime: "6 min read",
    date: "2025-01-05",
    image: "/images/blog/common-failures.jpg",
    slug: "common-mot-failures"
  },
  {
    id: 4,
    title: "The Complete Guide to MOT Reminders and Notifications",
    excerpt: "Never miss an MOT again with our comprehensive guide to setting up effective reminders and staying compliant with vehicle testing requirements.",
    category: "MOT Reminders",
    readTime: "4 min read",
    date: "2024-12-28",
    image: "/images/blog/mot-reminders.jpg",
    slug: "mot-reminders-guide"
  },
  {
    id: 5,
    title: "Fleet Management: Keeping Multiple Vehicles MOT Compliant",
    excerpt: "Essential strategies for fleet managers to maintain MOT compliance across multiple vehicles and avoid costly penalties.",
    category: "Fleet Management",
    readTime: "8 min read",
    date: "2024-12-20",
    image: "/images/blog/fleet-management.jpg",
    slug: "fleet-management-mot"
  },
  {
    id: 6,
    title: "Understanding MOT Certificates and Documentation",
    excerpt: "A complete breakdown of MOT certificates, what they mean, and how to properly maintain your vehicle testing records.",
    category: "MOT Documentation",
    readTime: "5 min read",
    date: "2024-12-15",
    image: "/images/blog/mot-certificates.jpg",
    slug: "mot-certificates-documentation"
  }
]

const categories = [
  "All Posts",
  "MOT Testing",
  "Vehicle Maintenance", 
  "MOT Failures",
  "MOT Reminders",
  "Fleet Management",
  "MOT Documentation"
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3">
                <Image
                  src="/images/logo.png"
                  alt="MOT Alert Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span className="text-xl font-bold text-gray-900">MOT Alert</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900 transition-colors">
                Sign In
              </Link>
              <Link href="/auth/signup" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            MOT Alert Blog
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Expert insights, tips, and guides to help you stay MOT compliant and keep your vehicles roadworthy.
            Stay informed with the latest updates and best practices.
          </p>
        </div>
      </section>

      {/* Search and Categories */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blog posts..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === "All Posts"
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow">
                {/* Post Image */}
                <div className="h-48 bg-gradient-to-br from-primary-100 to-blue-100 flex items-center justify-center">
                  <div className="text-center text-primary-600">
                    <Calendar className="w-16 h-16 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">Blog Post</p>
                  </div>
                </div>
                
                {/* Post Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <time className="text-sm text-gray-500">
                      {new Date(post.date).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                    
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          {/* Load More */}
          <div className="text-center mt-12">
            <button className="btn-primary px-8 py-3">
              Load More Posts
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Stay Updated with MOT News
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get the latest MOT testing updates, vehicle maintenance tips, and industry insights delivered to your inbox.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button className="btn-primary px-6 py-3 whitespace-nowrap">
              Subscribe
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            No spam, unsubscribe at any time. We respect your privacy.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src="/images/logo.png"
                  alt="MOT Alert Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span className="text-xl font-bold">MOT Alert</span>
              </div>
              <p className="text-gray-400 mb-4">
                Professional MOT tracking service helping drivers across the UK stay compliant and safe.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/check-example" className="hover:text-white transition-colors">Check Example</Link></li>
                <li><Link href="/auth/signup" className="hover:text-white transition-colors">Get Started</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/#contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/#contact" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><a href="tel:+03333220408" className="hover:text-white transition-colors">+0333 322 0408</a></li>
                <li><a href="mailto:info@facsystems.co.uk" className="hover:text-white transition-colors">info@facsystems.co.uk</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MOT Alert. A service of FAC Systems Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
