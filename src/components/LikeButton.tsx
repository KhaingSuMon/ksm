"use client";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import confetti from "canvas-confetti";
import { useDeviceLiked } from "./UserId";
import { insertRealLikeDevice } from "@/db/query/realLikeDevices";
import { getCount, incrementCount } from "@/db/query/allLikesCount";
import { formatNumber } from "@/lib/utils";
import { MyTooltip } from "./Tooltip";

const LikeButton = () => {
  const [likeCount, setLikeCount] = useState(0);
  const { liked, digestId, setLiked } = useDeviceLiked();
  const timeOutRef = React.useRef<NodeJS.Timeout>();
  const cachedLikeCount = React.useRef(0);
  const likedRef = React.useRef(liked);
  likedRef.current = liked;
  const digestIdRef = React.useRef(digestId);
  digestIdRef.current = digestId;
  const setLikedRef = React.useRef(setLiked);
  setLikedRef.current = setLiked;

  const fireHeartConfetti = useCallback(() => {
    const colors = ["#FF69B4", "#FF1493", "#FF69B4"];
    const angleSpread = 60;
    const particleCount = 5;

    confetti({
      particleCount,
      angle: 60,
      spread: angleSpread,
      origin: { x: 0, y: 1 },
      colors: colors,
    });

    confetti({
      particleCount,
      angle: 120,
      spread: angleSpread,
      origin: { x: 1, y: 1 },
      colors: colors,
    });

    confetti({
      particleCount: particleCount * 2,
      angle: 90,
      spread: angleSpread,
      origin: { x: 0.5, y: 1 },
      colors: colors,
    });
  }, []);

  const handleLike = useCallback(() => {
    setLikeCount((prevCount) => prevCount + 1);
    cachedLikeCount.current = cachedLikeCount.current + 1;

    fireHeartConfetti();
  }, [fireHeartConfetti]);
  useEffect(() => {
    timeOutRef.current = setTimeout(() => {
      if (cachedLikeCount.current > 0) {
        if (!likedRef.current && digestIdRef.current) {
          insertRealLikeDevice({
            digestId: digestIdRef.current,
          });
          setLikedRef.current();
        }
        incrementCount(cachedLikeCount.current);
        cachedLikeCount.current = 0;
      }
    }, 3000);

    return () => {
      clearTimeout(timeOutRef.current);
    };
  }, [likeCount]);

  useEffect(() => {
    (async () => {
      const count = await getCount();
      setLikeCount(count);
    })();
  }, []);

  const formattedCount = useMemo(() => formatNumber(likeCount), [likeCount]);

  return (
    <MyTooltip content={likeCount}>
      <motion.button
        className="relative"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleLike}
      >
        <FaHeart className="text-pink-400 text-4xl" />
        <motion.span
          className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          {formattedCount}
        </motion.span>
      </motion.button>
    </MyTooltip>
  );
};

export default LikeButton;
