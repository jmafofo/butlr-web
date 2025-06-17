// // pages/api/generate.ts
// import type { NextApiRequest, NextApiResponse } from "next";
// import { createClient } from "@supabase/supabase-js";
// import { InsightData } from "@/types/insights";

// // Initialize Supabase client
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   try {
//     const { query, tone } = req.body;

//     const prompt = `For the topic "${query}", in "${tone}" tone, suggest JSON with:
//     {
//       "keywords": [5 keywords],
//       "tags": [7 tags],
//       "title_variants": [3 title strings],
//       "thumbnail_prompt": "string"
//     }`;

//     const openaiRes = await fetch("https://api.openai.com/v1/completions", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "text-davinci-003", // correct model for /completions
//         prompt,
//         max_tokens: 512,
//         temperature: 0.7,
//       }),
//     });

//     const data = await openaiRes.json();

//     const text = data?.choices?.[0]?.text?.trim();
//     if (!text) throw new Error("No text returned from OpenAI");

//     const parsed = JSON.parse(text);
//     const { keywords, tags, title_variants, thumbnail_prompt } = parsed;

//     const { error } = await supabase.from("suggestions").insert([
//       { query, tone, keywords, tags, title_variants, thumbnail_prompt },
//     ]);

//     if (error) {
//       console.error("Supabase insert error:", error);
//       return res.status(500).json({ error: "Failed to insert into database" });
//     }

//     return res.status(200).json({ keywords, tags, title_variants, thumbnail_prompt });
//   } catch (err: any) {
//     console.error("Error:", err);
//     return res.status(500).json({ error: err.message || "Something went wrong" });
//   }
// }
