import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [postId, setPostId] = useState(null);
  const [comments, setComments] = useState([]);

  // Fetch users list on component mount
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  // Create new post based on selected user
  const createPost = () => {
    if (!selectedUser) return alert('Please select a user');
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: postTitle,
        body: postBody,
        userId: selectedUser.id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setPostId(data.id); // Ensure postId is set
        alert('Post created successfully!');
        console.log('Created post with ID:', data.id); // Debugging
      })
      .catch((error) => console.error('Error creating post:', error));
  };

  // Fetch comments for the created post
  const getComments = () => {
    // Temporarily using postId = 1 for testing
    const testPostId = 1;
    console.log(`Fetching comments for postId: ${testPostId}`); // Debugging
    fetch(`https://jsonplaceholder.typicode.com/comments?postId=${testPostId}`)
      .then((response) => response.json())
      .then((data) => {
        setComments(data); // Set the comments to state
        console.log('Fetched comments:', data); // Debugging
      })
      .catch((error) => console.error('Error fetching comments:', error));
  };
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">API Chaining Dashboard</h1>

      {/* User Selection */}
      <div className="mb-4">
        <label className="block mb-2 text-lg">Select User:</label>
        <select
          className="p-2 border rounded w-full"
          value={selectedUser ? selectedUser.id : ''}
          onChange={(e) => {
            const user = users.find((u) => u.id === parseInt(e.target.value));
            setSelectedUser(user);
          }}
        >
          <option value="">-- Select User --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      {/* Post Creation Form */}
      <div className="mb-4">
        <label className="block mb-2 text-lg">Post Title:</label>
        <input
          className="p-2 border rounded w-full"
          type="text"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-lg">Post Body:</label>
        <textarea
          className="p-2 border rounded w-full"
          value={postBody}
          onChange={(e) => setPostBody(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <button
        className="bg-blue-500 text-white p-2 rounded mb-4"
        onClick={createPost}
      >
        Create Post
      </button>
      <button
        className="bg-green-500 text-white p-2 rounded mb-4 ml-4"
        onClick={getComments}
      >
        Get Comments
      </button>

      {/* Comments Section */}
      {Array.isArray(comments) && comments.length > 0 ? (
        <div>
          <h2 className="text-xl font-bold mt-6">Comments:</h2>
          <ul className="list-disc ml-6">
            {comments.map((comment) => (
              <li key={comment.id} className="mb-2">
                <strong>{comment.name}:</strong> {comment.body}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No comments to display</p>
      )}
    </div>
  );
};

export default App;
