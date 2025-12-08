import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Helmet } from 'react-helmet';
import { LoaderCircle, Calendar, ArrowRight } from 'lucide-react';

const BlogIndex = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    // Only fetch published posts for the public feed
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  if (loading) return <div className="p-20 text-center text-white"><LoaderCircle className="animate-spin mx-auto" /></div>;

  return (
    <div className="w-full h-full bg-slate-900 pt-8 pb-20 px-4">
      <Helmet>
        <title>VRS/A Blog - Music Industry & Lyricism Deep Dives</title>
        <meta name="description" content="Unfiltered analysis on songwriting, the music industry, and AI tools. Written by Nico 'The Shade' Reyes." />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
          THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">ARCHIVES</span>
        </h1>
        <p className="text-xl text-slate-400 mb-12 border-l-4 border-indigo-500 pl-4 italic">
          "My respect is earned, not given. This is where I break down the noise." — Nico
        </p>

        <div className="grid gap-8">
          {posts.map(post => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="group relative bg-slate-800/50 border border-slate-700 hover:border-indigo-500 rounded-2xl overflow-hidden transition-all hover:scale-[1.01]">
              <div className="p-8">
                <div className="flex items-center gap-3 text-slate-500 text-sm mb-4 font-mono uppercase tracking-wider">
                  <Calendar size={14} />
                  {new Date(post.created_at).toLocaleDateString()}
                  <span className="w-1 h-1 bg-slate-600 rounded-full" />
                  {post.author_name}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-400 leading-relaxed mb-6">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-indigo-400 font-bold text-sm">
                  READ TRANSMISSION <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogIndex;