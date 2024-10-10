import { connect } from "@/lib/connect";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function PostsPage() {
  const { userId } = auth();

  const db = connect();

  const posts = await db.query(`SELECT * FROM week9projectposts
JOIN week9projectprofiles ON week9projectposts.clerk_id=week9projectprofiles.clerk_id`);
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
          </div>
        );
      })}
    </div>
  );
}
