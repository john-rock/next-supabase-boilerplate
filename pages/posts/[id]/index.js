import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";

export default function ViewPost({ post }) {
  const router = useRouter();

  return (
    <>
      <h1>Bike details</h1>
      <label>Make: {post.content}</label>
      <div>
        <Link href={`/posts/${post.id}/edit`}>
          <a className="button">Edit post</a>
        </Link>
        <button
          onClick={async (evt) => {
            await supabase.from("posts").delete().match({ id: post.id });

            router.replace("/");
          }}
        >
          Delete post
        </button>
      </div>
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
