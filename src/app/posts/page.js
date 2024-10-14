import { connect } from "@/lib/connect";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import LikeButton from "../components/LikeButton";
import { revalidatePath } from "next/cache";
import CommentDisplay from "../components/CommentDisplay";
import DeleteButton from "../components/DeleteButton";

export default async function PostsPage() {
  async function handleDelete(postId) {
    "use server";
    // console.log("Attempting to delete post with ID:", postId);
    try {
      const db = connect();
      const result = await db.query(
        "DELETE FROM week9ProjectPosts WHERE id = $1",
        [postId]
      );
      console.log(result);
    } catch (e) {
      console.error(e);
    }
    // console.log(`Number of posts deleted: ${result.rowCount}`);
    revalidatePath(`/posts`);
  }

  const { userId } = auth();
  const db = connect();

  // const post2 = await db.query(`
  //   SELECT posts.id AS post_id, posts.clerk_id AS post_clerk_id, posts.content, posts.created_at, profiles.id AS profile_id, profiles.clerk_id AS profile_clerk_id, profiles.first_name, profiles.last_name, profiles.bio, profiles.profile_image, COUNT (likes.id) AS likes
  //   FROM week9ProjectPosts AS posts
  //   INNER JOIN week9ProjectProfiles AS profiles
  //   ON posts.clerk_id = profiles.clerk_id
  //   LEFT JOIN week9ProjectPostLikes AS likes ON posts.id = likes.post_id
  //   GROUP BY posts.id, profiles.id
  //   `);

  const posts = await db.query(
    `SELECT posts.id AS post_id, posts.clerk_id AS post_clerk_id, posts.content, posts.created_at, profiles.id AS profile_id, profiles.clerk_id AS profile_clerk_id, profiles.first_name, profiles.last_name, profiles.bio, profiles.profile_image, COUNT (likes.id) AS likes
    FROM week9ProjectPosts AS posts
    INNER JOIN week9ProjectProfiles AS profiles
    ON posts.clerk_id = profiles.clerk_id
    LEFT JOIN week9ProjectPostLikes AS likes ON posts.id = likes.post_id
    GROUP BY posts.id, profiles.id`
  );
  // console.log(posts.rows);

  async function handleCreatePost(formData) {
    "use server";
    const db = connect();
    const content = formData.get("content");
    await db.query(
      `INSERT INTO week9projectposts (clerk_id, content) VALUES ($1, $2)`,
      [userId, content]
    );
  }

  async function updateLikes(postId, userId, hasLiked) {
    "use server";
    const db = connect();
    if (hasLiked == true) {
      await db.query(
        `DELETE FROM week9ProjectPostLikes WHERE post_id = $1 AND clerk_id = $2`,
        [postId, userId]
      );
    } else {
      await db.query(
        `INSERT INTO week9ProjectPostLikes (post_id, clerk_id) VALUES ($1, $2)`,
        [postId, userId]
      );
    }
    revalidatePath("/posts");
  }

  async function checkIfLiked(postId, userId) {
    "use server";
    const db = await connect();
    const result = await db.query(
      `SELECT * FROM week9ProjectPostLikes WHERE post_id = $1 AND clerk_id = $2`,
      [postId, userId]
    );
    return result.rows.length > 0;
  }

  async function selectAllComments(postId) {
    "use server";
    const db = connect();
    // console.log("postie", postId);
    const result = await db.query(
      `SELECT c.comment, c.id, p.first_name, p.last_name, p.profile_image
       FROM week9ProjectComments c
       INNER JOIN week9ProjectProfiles p ON c.clerk_id = p.clerk_id
       WHERE c.post_id = $1`,
      [postId]
    );
    // console.log("Comments fetched from the database:", result.rows);
    return result.rows;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Posts</h2>
      <h2 className="text-xl font-medium text-gray-600 mb-6">Add New Post</h2>

      <form action={handleCreatePost} className="mb-8">
        <textarea
          name="content"
          placeholder="New Post"
          className="w-full p-4 rounded-md shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>

      <h3 className="text-lg font-medium text-gray-700 mb-6">All Posts</h3>

      {posts.rows.map((post) => {
        return (
          <div key={post.id} className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="relative bg-white  rounded-lg p-6 mb-6 group">
              <DeleteButton
                postId={post.post_id}
                serverAction={handleDelete}
                className="ml-auto"
              />
            </div>

            <div className="flex items-center mb-4">
              <Image
                src={post.profile_image}
                width={50}
                height={50}
                alt="profile picture"
                className="rounded-full"
              />
              <h3 className="ml-4 text-lg font-bold text-gray-800">
                {post.first_name} {post.last_name} says:
              </h3>
            </div>

            <p className="text-gray-700 mb-4">{post.content}</p>

            <div className="flex items-center justify-between">
              <p className="text-gray-500">{post.likes} Likes</p>
              <LikeButton
                postId={post.post_id}
                userId={userId}
                initialLikes={post.likes}
                serverAction={updateLikes}
                checkIfLiked={checkIfLiked}
              />
            </div>

            <CommentDisplay
              postId={post.post_id}
              userId={userId}
              serverAction={selectAllComments}
            />
          </div>
        );
      })}
    </div>
  );
}
