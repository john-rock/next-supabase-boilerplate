import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../supabase-client";
import { useSession } from "../utils/user-context";

export default function Home() {
  const { session } = useSession();
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">
        NextJS Supabase Starter
      </h1>
    </div>
  );
}
