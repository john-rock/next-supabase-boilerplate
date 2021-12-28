import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Auth, Typography, Button } from '@supabase/ui';
const { Text } = Typography;
import { supabase } from '../api';

function Profile(props) {
  // Set the user from the database
  const { user } = Auth.useUser();

  // Get posts for the current user
  const [posts, setPosts] = useState([]);

  // Hook to fetch posts from the database
  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch posts from the database
  async function fetchPosts() {
    const user = supabase.auth.user();
    const { data } = await supabase
      .from('posts')
      .select('*')
      .filter('user_id', 'eq', user.id);
    setPosts(data);
  }

  // Delete post from the database
  async function deletePost(id) {
    await supabase.from('posts').delete().match({ id });
    fetchPosts();
  }

  if (user)
    return (
      <>
        <Text>Signed in: {user.email}</Text>
        {posts.map((post, index) => (
          <div key={index} className='border-b border-gray-300	mt-8 pb-4'>
            <h2 className='text-xl font-semibold'>{post.title}</h2>
            <p className='text-gray-500 mt-2 mb-2'>Author: {post.user_email}</p>
            <Link href={`/edit-post/${post.id}`}>
              <a className='text-sm mr-4 text-blue-500'>Edit Post</a>
            </Link>
            <Link href={`/posts/${post.id}`}>
              <a className='text-sm mr-4 text-blue-500'>View Post</a>
            </Link>
            <button
              className='text-sm mr-4 text-red-500'
              onClick={() => deletePost(post.id)}
            >
              Delete Post
            </button>
          </div>
        ))}
        <Button block onClick={() => props.supabaseClient.auth.signOut()}>
          Sign out
        </Button>
      </>
    );
  return props.children;
}

export default function AuthProfile() {
  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <Profile supabaseClient={supabase}>
        <Auth supabaseClient={supabase} />
      </Profile>
    </Auth.UserContextProvider>
  );
}
