import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import PostForm from "../../components/PostForm";
import { supabase } from "../../supabase-client";

export default function NewPost() {
  const [postContent, setPostContent] = useState("");
  const router = useRouter();
  const session = supabase.auth.session();

  return (
    <>
      <h1>Create new post</h1>
      <PostForm
        postContent={postContent}
        onPostContentChange={(evt) => setPostContent(evt.target.value)}
        onSubmit={async (evt) => {
          evt.preventDefault();
          await supabase.from("posts").insert({
            content: postContent,
            user_id: session.user.id,
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

  return {
    props: {},
  };
};
