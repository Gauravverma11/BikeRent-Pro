import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Share2, MessageCircle, Heart, ChevronRight } from 'lucide-react';
import Footer from '../components/Footer';

const BLOG_CONTENT = {
    'premium-riding-experience': {
        title: "The Ultimate Guide to Premium Riding Experience",
        fullContent: `Rentals aren't just about getting from point A to B; they're about the journey in between. In this guide, we dive deep into how you can elevate your riding experience with our premium fleet.

        ### 1. Selecting the Right Ride
        Our fleet ranges from agile 150cc commuters to 600cc+ performance monsters. For urban agility, the MT-15 or Duke series is unbeatable. But if you're planning a coastal cruise, nothing beats the classic charm of a Royal Enfield or the smoothness of an EV.

        ### 2. The Power of Maintenance
        Every BikeRent Pro vehicle undergoes a 50-point quality check. This ensures that when you twist the throttle, the response is exactly what you expect—crisp, reliable, and powerful.

        ### 3. Safety First
        A premium experience is a safe experience. We provide high-quality DOT-certified helmets and optional riding jackets for long-distance rentals. Don't compromise on gear!

        *Riding is not a hobby, it's a lifestyle.*`,
        category: "Guides",
        author: "Vikram Singh",
        date: "March 1, 2025",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1558981403-c5f91cbba527?w=1200&q=80"
    },
    'top-destinations-bangalore': {
        title: "Top 10 Weekend Getaways from Bangalore on a Bike",
        fullContent: `Bangalore is blessed with geography. Within a 200km radius, you have hills, lakes, and heritage sites.

        ### The Classics:
        1. **Nandi Hills (60km):** The mandatory sunrise ride. Sharp curves and cool breeze.
        2. **Mysore (150km):** The perfect highway cruise on the new Expressway.
        3. **Coorg (250km):** For those seeking coffee plantations and winding mountain roads.

        The key to a successful weekend trip is an early start. Aim to cross the Hebbal flyover by 5:30 AM to beat the city sprawl.`,
        category: "Travel",
        author: "Ananya Iyer",
        date: "Feb 24, 2025",
        readTime: "8 min read",
        image: "https://images.unsplash.com/photo-1471466054146-e71bcc0d2bb2?w=1200&q=80"
    }
};

const BlogPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const post = BLOG_CONTENT[id] || BLOG_CONTENT['premium-riding-experience']; // Fallback for demo

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    return (
        <div className="max-w-4xl mx-auto space-y-20 font-sans">
            {/* Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/blog')}
                    className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Journal
                </button>
                <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Heart className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Hero Header */}
            <div className="space-y-6 text-center">
                <div className="flex items-center justify-center gap-3">
                    <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {post.category}
                    </span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> {post.readTime}
                    </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-tight uppercase italic">
                    {post.title}
                </h1>
                <div className="flex items-center justify-center gap-6 pt-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-950 flex items-center justify-center text-white text-xs font-black border border-white/10 shadow-xl">
                            {post.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-black text-gray-900 leading-tight">{post.author}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">{post.date}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Image */}
            <div className="relative h-[400px] md:h-[600px] rounded-[3rem] overflow-hidden shadow-2xl group border border-gray-100">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Article Content */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-gray-100 shadow-sm">
                <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-p:font-medium prose-p:text-gray-600 prose-p:leading-relaxed whitespace-pre-line italic text-lg border-l-4 border-blue-600 pl-8 mb-12 bg-blue-50/30 py-4">
                    "{post.fullContent.split('\n\n')[0]}"
                </div>

                <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-p:font-medium prose-p:text-gray-600 prose-p:leading-relaxed whitespace-pre-line">
                    {post.fullContent.split('\n\n').slice(1).join('\n\n')}
                </div>

                {/* Tags & Footer */}
                <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-wrap gap-2">
                        {['Adventure', 'Rentals', 'Premium', 'Safety'].map(tag => (
                            <span key={tag} className="px-4 py-2 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors border border-gray-100">
                                # {tag}
                            </span>
                        ))}
                    </div>
                    <button className="flex items-center gap-3 bg-gray-950 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-900/20">
                        <MessageCircle className="w-5 h-5 text-blue-500" />
                        Join Discussion
                    </button>
                </div>
            </div>

            {/* Related Posts Link */}
            <div className="pt-10">
                <Link to="/blog" className="flex items-center justify-between p-8 bg-blue-600 rounded-[2.5rem] text-white group hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                            <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-1">Explore More</p>
                            <h3 className="text-2xl font-black uppercase tracking-tighter italic">Back to the Rider's Journal</h3>
                        </div>
                    </div>
                </Link>
            </div>

            <Footer />
        </div>
    );
};

export default BlogPost;
