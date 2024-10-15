"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function CommentDisplay({ postId, serverAction }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function fetchComments() {
      const result = await serverAction(postId);
      if (result && result.length > 0) {
        setComments(result); // Set comments state
        console.log("Comments state set:", result); // Confirm setting state
      }
    }
    fetchComments();
  }, [postId, serverAction]);

  console.log("Current comments state:", comments); // Log the current comments state

  return (
    <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Comments</h3>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div
            key={comment.id}
            className="flex gap-4 items-start mb-4 border-b pb-4 border-gray-300"
          >
            <div className="w-10 h-10">
              <Image
                src={comment.profile_image}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {comment.first_name} {comment.last_name}
              </p>
              <p className="text-sm text-gray-600 mt-1">{comment.comment}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No comments yet.</p>
      )}
    </div>
  );
}
