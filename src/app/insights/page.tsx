"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { generateInsights } from "@/lib/openaiClient";
import type { User } from "@supabase/supabase-js";
import { InsightData, SavedSuggestion } from "@/types/insights";
import { motion } from "framer-motion";

export default function InsightsPage() {
  const [query, setQuery] = useState("");
  const [tone, setTone] = useState("SEO‑Rich");
  const [res, setRes] = useState<InsightData>();
  const [saved, setSaved] = useState<SavedSuggestion[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        fetchSaved();
      }
    }
    checkUser();

    // Optional: subscribe to auth changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchSaved();
        } else {
          setSaved([]);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  async function run() {
    if (!user) return;
    setLoader(true);
    const data = await generateInsights(query, tone);
  
    try {
      const insight = (data as { insight: string }).insight;
  
      // Remove ```json\n and \n```, then only keep up to the first closing }
      const jsonBlock = insight
        .replace(/```json\n|\n```/g, "")
        .trim()
        .split("}")[0] + "}"; // keep content until the first closing }
  
      const parsed = JSON.parse(jsonBlock);
      setRes(parsed);
    } catch (error) {
      console.error("Failed to parse insight JSON:", error);
    } finally {
      setLoader(false);
    }
    
  }  

  async function fetchSaved() {
    const { data } = await supabase
      .from("suggestions")
      .select("*")
      .order("created_at", { ascending: false });
    setSaved(data || []);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white px-4">
        <h2 className="text-2xl mb-4">Please log in to view this page.</h2>
        <button
          onClick={() => supabase.auth.signInWithOAuth({ provider: "github" })} // example provider
          className="px-6 py-3 bg-purple-600 rounded hover:bg-purple-700"
        >
          Log in with GitHub
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="max-w-5xl mx-auto px-6 pt-40 pb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
        >
          GetButlr Insights
        </motion.h1>
      {loader ? (
            <div className="flex justify-center py-4 mt-5">
            <img
              src="/loading.gif"
              alt="Loading animation"
              className="w-84 h-84 object-contain overflow-hidden"
              style={{ backgroundColor: 'transparent' }}
            />
          </div>
          
          ) : (
            <>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-10 space-y-4 max-w-md mx-auto"
        >
          <input
            type="text"
            placeholder="Enter topic or video title"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 rounded bg-slate-800 text-white border border-slate-700"
          />

          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full p-3 rounded bg-slate-800 text-white border border-slate-700"
          >
            {["Conversational", "Clickbait", "SEO‑Rich"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={run}
            className="w-full p-3 rounded bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold"
          >
            Get Insights
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchSaved}
            className="w-full p-3 rounded bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold"
          >
            Refresh Saved
          </motion.button>
        </motion.div>
        {res && (
          <div className="bg-white p-6 rounded-lg shadow-md mt-8 text-gray-900 space-y-6">
            <h2 className="text-xl font-semibold text-blue-600">🎯 Suggestions ({tone})</h2>

            <div>
              <h3 className="font-medium text-gray-800 mb-1">🗝️ Keywords:</h3>
              <p className="text-sm text-gray-700">{res.keywords.join(", ")}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-1">🏷️ Tags:</h3>
              <p className="text-sm text-gray-700">{res.tags.join(", ")}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3">📢 Title Variants:</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {res.title_variants.map((title: string, idx: number) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-lg px-4 py-2 shadow-md max-w-xs"
                  >
                    {title}
                  </div>
                ))}
              </div>
            </div>


            <div>
              <h3 className="font-medium text-gray-800 mb-1">🖼️ Thumbnail Prompt:</h3>
              <p className="text-sm text-gray-700 whitespace-pre-line">{res.thumbnail_prompt}</p>
            </div>
          </div>
        )}
        {saved.length > 0 && (
          <div className="mt-10 text-black">
            <h2>Saved Results</h2>
            {saved.map((item) => (
              <details key={item.id} className="border bg-white p-2 mb-2 rounded">
                <summary>
                  {item.query} — {new Date(item.created_at).toLocaleString()}
                </summary>
                <div>
                  <strong>Tone:</strong> {item.tone}
                </div>
                <div>
                  <strong>Keywords:</strong> {item.keywords.join(", ")}
                </div>
                <div>
                  <strong>Tags:</strong> {item.tags.join(", ")}
                </div>
              </details>
            ))}
          </div>
        )}
        </>
          )}
      </div>
    </div>
  );
}
