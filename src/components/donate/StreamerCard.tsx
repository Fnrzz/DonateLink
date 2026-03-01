"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import type { Profile } from "@/lib/supabase/types";

export function StreamerCard({ profile }: { profile: Profile }) {
  const initial = (profile.display_name || profile.username).charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 text-center"
    >
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center border-3 border-border bg-primary text-3xl font-black text-white shadow-[4px_4px_0_#000]">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name}
            className="h-full w-full object-cover"
          />
        ) : (
          initial
        )}
      </div>
      <h1 className="mb-1 flex items-center justify-center gap-1.5 text-2xl font-black uppercase text-text-primary">
        {profile.display_name || profile.username}
        {profile.is_registered_onchain && (
          <CheckCircle className="h-5 w-5 text-success" />
        )}
      </h1>
      {profile.bio && (
        <p className="mx-auto max-w-sm text-sm font-medium text-text-secondary">
          {profile.bio}
        </p>
      )}
    </motion.div>
  );
}
