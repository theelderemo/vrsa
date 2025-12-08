import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Helmet } from 'react-helmet';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw'; // If you want to allow HTML inside markdown
import { ArrowLeft, Clock } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) console.error(error);
      setPost(data);
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  if (loading) return <div className="p-20 text-center"><div className="animate-spin w-8 h-8 border-4 border-indigo-500 rounded-full border-t-transparent mx-auto"></div></div>;
  if (!post) return <div className="text-center text-white py-20">Transmission not found.</div>;

  return (
    <article className="w-full h-full pt-8 pb-20 px-4">
      {/* Dynamic SEO Meta Tags - CRITICAL */}
      <Helmet>
        <title>{post.title} | VRS/A Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <Link to="/blog" className="inline-flex items-center text-slate-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Archives
        </Link>

        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-sm border-b border-slate-800 pb-8">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-xs">NR</div>
                {post.author_name}
             </div>
             <span>•</span>
             <div className="flex items-center gap-1">
                <Clock size={14} />
                {new Date(post.created_at).toLocaleDateString()}
             </div>
          </div>
        </header>

        {/* The Content Area - Styled for readability */}
        <div className="prose prose-invert prose-lg prose-indigo max-w-none">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
};

export default BlogPost;