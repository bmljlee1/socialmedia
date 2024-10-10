import Link from "next/link";

export default function Navbar() {
  return (
    <>
      <Link href="/">Home</Link>
      <Link href="/profile">My Profile</Link>
      <Link href="/posts">Posts</Link>
    </>
  );
}
