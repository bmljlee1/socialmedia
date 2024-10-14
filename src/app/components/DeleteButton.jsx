"use client";

export default function DeleteButton({ serverAction, postId }) {
  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    try {
      // actually calling the function
      serverAction(postId);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="absolute top-2 right-2 text-grey-300 font-bold text-xl hidden group-hover:block"
    >
      ×
    </button>
  );
}
