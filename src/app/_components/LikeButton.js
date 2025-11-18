'use client';

import { useState } from 'react';
import { createBrowserClient } from '@/lib/supabase-browser';

export default function LikeButton({ postId, initialLikes = 0 }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const supabase = createBrowserClient();

      // Toggle like state optimistically
      const newIsLiked = !isLiked;
      const newLikes = newIsLiked ? likes + 1 : likes - 1;

      setIsLiked(newIsLiked);
      setLikes(newLikes);

      // Update in database
      const { error } = await supabase
        .from('nwp_posts')
        .update({ like_count: newLikes })
        .eq('id', postId);

      if (error) {
        // Revert on error
        setIsLiked(!newIsLiked);
        setLikes(likes);
        console.error('Error updating like:', error);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert on error
      setIsLiked(!isLiked);
      setLikes(likes);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        isLiked
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-label={isLiked ? 'Unlike post' : 'Like post'}
    >
      <svg
        className="w-5 h-5"
        fill={isLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="font-medium">{likes}</span>
    </button>
  );
}
