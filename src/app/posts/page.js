import { connect } from "@/lib/connect";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import LikeButton from "../components/LikeButton";
import { revalidatePath } from "next/cache";
import CommentDisplay from "../components/CommentDisplay";

export default async function PostsPage() {
  const { userId } = auth();

  const db = connect();

  const posts =
    await db.query(`SELECT week9ProjectPosts.*, week9ProjectProfiles.*, COUNT(week9ProjectPostLikes.id) AS likes
  FROM week9ProjectPosts
  JOIN week9ProjectProfiles ON week9ProjectPosts.clerk_id = week9ProjectProfiles.clerk_id
  LEFT JOIN week9ProjectPostLikes ON week9ProjectPosts.id = week9ProjectPostLikes.post_id
  GROUP BY week9ProjectPosts.id, week9ProjectProfiles.id`);
  console.log(posts.rows);
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
    if (result.rows.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  async function selectAllComments(postId) {
    "use server";
    const db = connect();
    const result = await db.query(
      `SELECT c.comment, c.id, p.first_name, p.last_name, p.profile_image
       FROM week9ProjectComments c
       JOIN week9ProjectProfiles p ON c.clerk_id = p.clerk_id
       WHERE c.post_id = $1`,
      [postId]
    );
    console.log("Comments fetched from the database:", result.rows);
    return result.rows;
  }

  return (
    <div>
      <h2>Posts</h2>
      <h2>Add New Post</h2>
      <form action={handleCreatePost}>
        <textarea name="content" placeholder="New Post"></textarea>
        <button>submit</button>
      </form>

      <h3>All Posts</h3>
      {posts.rows.map((post) => {
        return (
          <div key={post.id}>
            <div>
              <Image
                src={post.profile_image}
                width={50}
                height={50}
                alt="profile picture"
              />
            </div>
            <h3>
              {post.first_name} {post.last_name} says:
            </h3>

            <p>{post.content}</p>
            <p>{post.likes}</p>
            <LikeButton
              postId={post.id}
              userId={userId}
              initialLikes={post.likes}
              serverAction={updateLikes}
              checkIfLiked={checkIfLiked}
            />
            <CommentDisplay
              postId={post.id}
              userId={userId}
              serverAction={selectAllComments}
            />
          </div>
        );
      })}
    </div>
  );
}
