import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { supabase } from "../../../supabase-client";
import PostForm from "../../../components/PostForm";

export default function EditPost({ post }) {
  const [postContent, setPostContent] = useState(post.content);
  const router = useRouter();

  return (
    <>
      <h1>Edit post</h1>
      <PostForm
        postContent={postContent}
        onPostContentChange={(evt) => setPostContent(evt.target.value)}
        onSubmit={async (evt) => {
          evt.preventDefault();
          await supabase
            .from("posts")
            .update({
              content: postContent,
            })
            .match({
              id: post.id,
            });

          router.push("/");
        }}
      />
    </>
  );
}

export const getServerSideProps = async (context) => {
  // get the user using the "sb:token" cookie
  const { user } = await supabase.auth.api.getUserByCookie(context.req);
  if (!user) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  supabase.auth.setAuth(context.req.cookies["sb:token"]);
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", context.query.id)
    .single();

  if (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
  };
};
