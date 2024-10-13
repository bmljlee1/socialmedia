export default function CommentFormInput({
  onChange,
  name,
  placeholder,
  type,
}) {
  return (
    <input
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      type={type}
      className="p-4 rounded-md hover:shadow-lg hover:shadow-black"
    />
  );
}
