import { useContext, useState, useCallback } from 'react';
import CommunityContext from '../context/CommunityContext';
import communityService from '../services/communityService';

const useCommunity = () => {
  const context = useContext(CommunityContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }

  const { posts, setPosts } = context;

  const getPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedPosts = await communityService.getPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [setPosts]);

  const createPost = useCallback(async (postData) => {
    setLoading(true);
    setError(null);
    try {
      const newPost = await communityService.createPost(postData);
      setPosts(prevPosts => [...prevPosts, newPost]);
      return newPost;
    } catch (err) {
      setError('Failed to create post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [setPosts]);

  const likePost = useCallback(async (postId) => {
    setError(null);
    try {
      const updatedPost = await communityService.likePost(postId);
      setPosts(prevPosts => prevPosts.map(post =>
        post.id === postId ? updatedPost : post
      ));
    } catch (err) {
      setError('Failed to like post');
      console.error(err);
    }
  }, [setPosts]);

  const commentOnPost = useCallback(async (postId, commentData) => {
    setError(null);
    try {
      const newComment = await communityService.commentOnPost(postId, commentData);
      setPosts(prevPosts => prevPosts.map(post =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      ));
      return newComment;
    } catch (err) {
      setError('Failed to add comment');
      console.error(err);
    }
  }, [setPosts]);

  return {
    posts,
    loading,
    error,
    getPosts,
    createPost,
    likePost,
    commentOnPost
  };
};

export default useCommunity;
