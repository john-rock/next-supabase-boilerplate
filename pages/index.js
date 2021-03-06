import { supabase } from '../supabase-client';
import { useSession } from '../utils/user-context';
import { useRouter } from 'next/router';

export default function Home({ posts }) {
  const { session } = useSession();
  const router = useRouter();
  return (
    <div>
      <h1>NextJS Supabase Starter</h1>

      <ul>
        {(posts || []).map((post) => (
          <li key={post.id}>
            <a className='button' href={`/posts/${post.id}`}>
              {post.content}
            </a>
          </li>
        ))}
      </ul>

      <div>
        {session && (
          <>
            <h3>Session data</h3>
            <h4>Access token: {session.access_token}</h4>
            <h4>Email: {session.user?.email}</h4>
            <button
              onClick={() => {
                supabase.auth.signOut();
                router.replace('/signin');
              }}
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps = async (context) => {
  // get the user using the "sb:token" cookie
  const { user } = await supabase.auth.api.getUserByCookie(context.req);
  // if (!user) {
  //   return {
  //     redirect: {
  //       destination: "/signin",
  //       permanent: false,
  //     },
  //   };
  // }

  // Query all posts
  supabase.auth.setAuth(context.req.cookies['sb:token']);
  const { data: posts, error } = await supabase.from('posts').select();

  if (error) {
    // Return 404 response.
    // No posts found or something went wrong with the query
    return {
      notFound: true,
    };
  }

  return {
    props: {
      posts,
    },
  };
};
