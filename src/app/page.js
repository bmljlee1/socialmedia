"use client"; // Add this line at the very top of your file

import { useState } from "react";

export default function Home() {
  const [joke, setJoke] = useState("");

  // Function to fetch a new joke
  const fetchJoke = async () => {
    const response = await fetch(
      "https://official-joke-api.appspot.com/random_joke"
    );
    const data = await response.json();
    setJoke(`${data.setup} - ${data.punchline}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
      <h1 className="text-5xl font-bold mb-6">FacePalm</h1>
      <p className="text-lg mb-8 text-center">
        Welcome to FacePalm! Your go-to social networking site for absolutely
        nothing!
      </p>

      <button
        onClick={fetchJoke}
        className="bg-yellow-400 hover:bg-yellow-500 text-black text-2xl font-bold py-4 px-8 rounded-full shadow-lg transition duration-300 ease-in-out mb-8"
      >
        Get a Joke!
      </button>

      <div className="bg-white text-black p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">
          Here&apos;s a joke for you:
        </h3>
        <p className="text-lg">{joke || "Press the button to get a joke!"}</p>
      </div>
    </div>
  );
}
