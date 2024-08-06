"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaFacebook, FaEnvelope, FaHeart } from "react-icons/fa";
import Image from "next/image";
import mePng from "@/assets/IMG_3569.jpg";
import LikeButton from "@/components/LikeButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl mx-auto"
        >
          <motion.div
            className="relative w-40 h-40 mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <Image
              src={mePng}
              alt="Khaing Su Mon"
              width={160}
              height={160}
              className="rounded-full object-cover border-4 border-pink-300 shadow-lg"
            />
            <FaHeart className="absolute -top-2 -right-2 text-pink-400 text-3xl animate-ping" />
            <FaHeart className="absolute -top-2 -right-2 text-pink-400 text-3xl" />
          </motion.div>
          <motion.h1
            className="text-4xl font-bold text-center text-purple-600 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {"こんにちは！ I'm Khaing Su Mon 👋"}
          </motion.h1>
          <motion.p
            className="text-xl text-center text-indigo-500 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            ✨ IT魔法使い | ミャンマーから日本へ冒険中 🌸
          </motion.p>
          <motion.div
            className="flex justify-center space-x-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <motion.a
              href="#"
              className="text-pink-500 hover:text-purple-500 transition-colors"
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaGithub size={28} />
            </motion.a>
            <motion.a
              href="#"
              target="_blank"
              className="text-pink-500 hover:text-purple-500 transition-colors"
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaFacebook size={28} />
            </motion.a>
            <motion.a
              href="mailto:hi@khaingsumon.com"
              target="_blank"
              className="text-pink-500 hover:text-purple-500 transition-colors"
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaEnvelope size={28} />
            </motion.a>
          </motion.div>
          <motion.p
            className="text-gray-600 text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            🚀 コードを書いてワクワクするのが大好き！
            <br />
            🍜 ラーメンと抹茶のエネルギーで動いてます
            <br />
            🌈 テクノロジーと文化の橋渡し、楽しんでやってます
          </motion.p>
          <motion.button
            className="block w-full bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold py-3 px-6 rounded-full hover:from-pink-500 hover:to-purple-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            私の冒険を覗いてみる！ 🎉
          </motion.button>
          <div className="flex justify-center mt-4">
            <LikeButton />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
