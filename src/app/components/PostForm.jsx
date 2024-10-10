"use client";
import PostFormInput from "./components/PostFormInput";
import { auth } from "@clerk/nextjs/server";
import { connect } from "@/lib/connect";
import { useState } from "react";

export default function PostForm({ handleSubmit }) {
  const [formData, setFormData] = useState({
    content: "",
  });

  // create handlechange function.

  const { userId } = auth();

  const db = connect();

  async function handleFormSubmit(event) {
    event.preventDefault();

    await handleSubmit(formData);

    setFormData({ content: "" });
    event.target.reset();
  }

  return (
    <>
      <div>{formData.content}</div>
      <form>
        <PostFormInput
          onChange={handleChange}
          name="content"
          placeholder="content"
          type="text"
          value={FormData.content}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
