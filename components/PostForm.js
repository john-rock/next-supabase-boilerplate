export default function PostForm({
  postContent,
  onPostContentChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit}>
      <label>
        Post
        <input
          name="postContent"
          value={postContent}
          placeholder="Post Content"
          onChange={onPostContentChange}
        />
      </label>
      <button type="submit">Save post</button>
    </form>
  );
}
