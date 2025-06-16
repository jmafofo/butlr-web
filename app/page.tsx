'use client';
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'


export default function Home() {
  const router = useRouter(); 
  const Button = dynamic(() => import('./components/ui/Button').then(mod => mod.Button), { ssr: false })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
        >
          Built for Creators. Ready for Every Platform.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg text-slate-300 mt-4"
        >
          Your AI content assistant. Titles, hashtags, thumbnails, and growth plans — powered by quiz-driven insights.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-8"
        >
          <Button
            size="lg"
            onClick={() => router.push('/pages')}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-lg px-8 py-4 rounded-full"
          >
            Start Free & Take the Quiz
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
