import { connect } from "@/lib/connect";

export default function Home() {
  const db = connect();

  return (
    <div>
      <h2>FacePalm</h2>
      <p>
        Welcome to FacePalm! Your go to social networking site for absolutely
        nothing!
      </p>
      <p>This is the Home page</p>
    </div>
  );
}
