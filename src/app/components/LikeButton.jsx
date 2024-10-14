"use client";
import { useState, useEffect } from "react";

export default function LikeButton({
  postId,
  userId,
  serverAction,
  checkIfLiked,
}) {
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    async function checkLikes() {
      const result = await checkIfLiked(postId, userId);
      setHasLiked(result);
    }
    checkLikes();
  }, [postId, userId]);

  // we are forcing re render - line 24 is trying to match up the database state with the local state...

  async function handleClick() {
    serverAction(postId, userId, hasLiked);
    setHasLiked(!hasLiked);
  }

  return (
    <div>
      <button onClick={handleClick}>{hasLiked ? "Liked" : "Like"}</button>
    </div>
  );
}

// when we like a users post - that seems to reset/modify the other users post
// carol is working -
// something to do with when a user has multple posts.
