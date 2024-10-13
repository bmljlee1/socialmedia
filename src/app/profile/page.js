import { connect } from "@/lib/connect";
import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";

export default async function ProfilePage() {
  const db = connect();
  const { userId } = auth();
  const user = await currentUser();
  console.log(user);
  async function handleUpdateProfile(formData) {
    "use server";
    const db = connect();
    // get the information from the form
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const bio = formData.get("bio");

    const profiles = await db.query(
      `SELECT * FROM week9projectprofiles WHERE clerk_id = $1`,
      [userId]
    );
    console.log(profiles.rows);

    if (profiles.rowCount === 0) {
      // insert our profile into the DB
      await db.query(
        `INSERT INTO week9projectprofiles (clerk_id, first_name, last_name, bio, profile_image) VALUES ($1, $2, $3, $4, $5)`,
        [userId, firstName, lastName, bio, user.imageUrl]
      );
    } else {
      // update the existing item
      await db.query(
        `UPDATE week9projectprofiles SET first_name=$1, last_name=$2 bio=$3 profile_image=$4 WHERE clerk_id=$5`,
        [firstName, lastName, bio, user.imageUrl, userId]
      );
    }
  }

  // check whether a profile exists
  const profiles = await db.query(
    `SELECT * FROM week9projectprofiles WHERE clerk_id = $1`,
    [userId]
  );
  console.log(profiles.rows);

  return (
    <>
      <div>
        <h2>Update Profile Page</h2>
        <p>This is your profile page to edit</p>
        <form action={handleUpdateProfile}>
          <input name="firstName" placeholder="First Name" />
          <input name="lastName" placeholder="Last Name" />
          <textarea name="bio" placeholder="Bio"></textarea>
          <button>Submit</button>
        </form>
      </div>
      <div>
        <h2>My Info</h2>
        <div>
          {profiles.rows.map((profile) => {
            return (
              <div key={profile.id}>
                <h3>
                  {profile.first_name} {profile.last_name}
                </h3>
                <p>{profile.bio}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
