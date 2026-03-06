import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Clock, User, ArrowRight, Filter } from 'lucide-react';
import Footer from '../components/Footer';

const BLOG_POSTS = [
    {
        id: 'premium-riding-experience',
        title: "The Ultimate Guide to Premium Riding Experience",
        excerpt: "Discover how to make the most of your luxury two-wheeler rental and explore the city in style.",
        category: "Guides",
        author: "Vikram Singh",
        date: "March 1, 2025",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1558981403-c5f91cbba527?w=800&q=80"
    },
    {
        id: 'top-destinations-bangalore',
        title: "Top 10 Weekend Getaways from Bangalore on a Bike",
        excerpt: "From Nandi Hills to Mysore, explore the best scenic routes for your next weekend escape.",
        category: "Travel",
        author: "Ananya Iyer",
        date: "Feb 24, 2025",
        readTime: "8 min read",
        image: "https://images.unsplash.com/photo-1471466054146-e71bcc0d2bb2?w=800&q=80"
    },
    {
        id: 'ev-future-india',
        title: "The Future of Electric Mobility in Indian Cities",
        excerpt: "Why switching to Electric Vehicles is not just good for the planet, but also for your wallet.",
        category: "Tech",
        author: "Rahul Sharma",
        date: "Feb 15, 2025",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80"
    },
    {
        id: 'safety-tips-night-rides',
        title: "Safety Tips for Night Riding in Urban Jungles",
        excerpt: "Essential gear and precautions you should take before heading out for a late-night cruise.",
        category: "Safety",
        author: "Sanjay Dutta",
        date: "Feb 10, 2025",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1531327431456-837da4b1d562?w=800&q=80"
    },
    {
        id: 'maintenance-rented-bike',
        title: "Basic Maintenance Tips for Your Rented Vehicle",
        excerpt: "Simple checks to ensure your long-term rental stays in peak condition throughout your journey.",
        category: "Guides",
        author: "Pooja Hegde",
        date: "Feb 5, 2025",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80"
    },
    {
        id: 'hidden-gems-mumbai',
        title: "Mumbai's Hidden Gems You Can Only Reach by Bike",
        excerpt: "Avoid the traffic and explore the narrow lanes of South Mumbai to find the city's best-kept secrets.",
        category: "Travel",
        author: "Karan Malhotra",
        date: "Jan 28, 2025",
        readTime: "7 min read",
        image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&q=80"
    }
];

const Blog = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Guides', 'Travel', 'Tech', 'Safety'];

    const filteredPosts = BLOG_POSTS.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-20 font-sans">
            {/* Header */}
            <header className="relative py-24 px-10 bg-gray-950 rounded-[3rem] overflow-hidden text-white border border-white/5 shadow-2xl">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-[100px]"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full translate-x-1/3 translate-y-1/3 blur-[120px]"></div>

                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-6xl font-black mb-6 tracking-tighter leading-tight uppercase italic">
                        The <span className="text-blue-500">Rider's</span> Journal.
                    </h1>
                    <p className="text-lg text-gray-400 font-bold uppercase tracking-widest leading-relaxed mb-10">
                        Insights, guides, and inspiration for the modern urban explorer.
                    </p>

                    {/* Search Bar */}
                    <div className="relative group max-w-md">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-blue-500/50 transition-all font-medium text-white placeholder:text-gray-600"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            {/* Filter Section */}
            <div className="flex flex-wrap items-center justify-between gap-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === cat
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                    {filteredPosts.length} Articles found
                </span>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredPosts.map((post, idx) => (
                    <article
                        key={post.id}
                        className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-gray-100/50 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 hover:-translate-y-2"
                        style={{ animationDelay: `${idx * 100}ms` }}
                    >
                        <Link to={`/blog/${post.id}`} className="relative h-64 overflow-hidden">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600 border border-white/20">
                                    {post.category}
                                </span>
                            </div>
                        </Link>

                        <div className="p-8 flex flex-col flex-grow space-y-4">
                            <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
                            </div>

                            <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                                <Link to={`/blog/${post.id}`}>{post.title}</Link>
                            </h3>

                            <p className="text-gray-500 font-medium text-sm leading-relaxed line-clamp-2 italic">
                                "{post.excerpt}"
                            </p>

                            <div className="pt-4 mt-auto flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-[10px] font-black border border-blue-100">
                                        {post.author.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <span className="text-xs font-bold text-gray-900">{post.author}</span>
                                </div>
                                <Link
                                    to={`/blog/${post.id}`}
                                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 group/link"
                                >
                                    Read Now
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* Newsletter CTA */}
            <section className="bg-blue-600 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                <div className="relative z-10 max-w-xl mx-auto">
                    <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">Stay Ahead of the Curve</h2>
                    <p className="text-blue-100 font-medium mb-8">Get exclusive riding tips, early access to new bikes, and member-only offers directly in your inbox.</p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-grow bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none placeholder:text-blue-200 font-medium focus:bg-white/20 transition-all"
                        />
                        <button className="bg-white text-blue-600 font-black px-8 py-4 rounded-2xl hover:bg-gray-100 transition-all active:scale-[0.98] uppercase tracking-widest text-sm shadow-xl shadow-blue-900/40">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Blog;
