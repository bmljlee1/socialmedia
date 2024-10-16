import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-semibold">
          <Link href="/">FacePalm</Link>
        </div>
        <div className="space-x-6">
          <Link href="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link href="/profile" className="text-gray-300 hover:text-white">
            My Profile
          </Link>
          <Link href="/posts" className="text-gray-300 hover:text-white">
            Posts
          </Link>
        </div>
      </div>
    </nav>
  );
}
