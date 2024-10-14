import { connect } from "@/lib/connect";
import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";

export default async function ProfilePage() {
  const db = connect();
  const { userId } = auth();
  const user = await currentUser();
  // console.log(user);

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
    // console.log(profiles.rows);

    if (profiles.rowCount === 0) {
      // insert our profile into the DB
      await db.query(
        `INSERT INTO week9projectprofiles (clerk_id, first_name, last_name, bio, profile_image) VALUES ($1, $2, $3, $4, $5)`,
        [userId, firstName, lastName, bio, user.imageUrl]
      );
    } else {
      // update the existing item
      await db.query(
        `UPDATE week9projectprofiles SET first_name=$1, last_name=$2, bio=$3, profile_image=$4 WHERE clerk_id=$5`,
        [firstName, lastName, bio, user.imageUrl, userId]
      );
    }
  }

  // check whether a profile exists
  const profiles = await db.query(
    `SELECT * FROM week9projectprofiles WHERE clerk_id = $1`,
    [userId]
  );
  // console.log(profiles.rows);

  return (
    <>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Update Profile Page
        </h2>
        <p className="mb-6 text-gray-600">This is your profile page to edit</p>

        <form
          action={handleUpdateProfile}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              name="firstName"
              placeholder="First Name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              name="lastName"
              placeholder="Last Name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="bio"
            >
              Bio
            </label>
            <textarea
              name="bio"
              placeholder="Bio"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update Profile
          </button>
        </form>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Info</h2>
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
            {profiles.rows.map((profile) => {
              return (
                <div key={profile.id} className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {profile.first_name} {profile.last_name}
                  </h3>
                  <p className="text-gray-600">{profile.bio}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
