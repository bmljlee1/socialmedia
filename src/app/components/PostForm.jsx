"use client";
import PostFormInput from "./components/PostFormInput";
import { useState } from "react";

export default function PostForm({ handleSubmit }) {
  const [formData, setFormData] = useState({
    content: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    const isFormComplete = Object.values({ ...formData, [name]: value }).every(
      (field) => field.length > 0 || field > 0
    );
    setIsDisabled(!isFormComplete);
  }

  async function handleFormSubmit(event) {
    event.preventDefault();

    await handleSubmit(formData);

    setFormData({ content: "" });
    event.target.reset();
  }

  return (
    <>
      <div>{formData.content}</div>
      <form onSubmit={handleFormSubmit}>
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
