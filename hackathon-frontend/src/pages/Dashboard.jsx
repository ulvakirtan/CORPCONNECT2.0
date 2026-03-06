import { useEffect, useState } from "react";
        import API from "../services/api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");

  // Fetch user + tasks
  useEffect(() => {
    if (!token) {
      window.location.href = "/";
      return;
    }

    fetchUser();
    fetchTasks();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await API.get("/protected", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(data.user);
    } catch {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  };

  const fetchTasks = async () => {
    try {
      const { data } = await API.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        "/tasks",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      {user && (
        <div>
          <p>Welcome, {user.name}</p>
        </div>
      )}

      <hr />

      <h3>Add Task</h3>
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <button type="submit">Add Task</button>
      </form>

      <hr/>

      <h3>Your Tasks</h3>
      {tasks.map((task) => (
        <div key={task._id} style={{ border: "1px solid black", margin: "10px 0", padding: "10px" }}>
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <button onClick={() => handleDelete(task._id)}>Delete</button>
        </div>
      ))}
      <button
  onClick={() => {
    localStorage.removeItem("token");
    window.location.href = "/";
  }}
>
  Logout
</button>
      {/* <button
  onClick={async () => {
    
              await API.delete("/auth/register", {
            data: { email, password },
            headers: { Authorization: `Bearer ${token}` }
          });
    localStorage.removeItem("token");
    window.location.href = "/";
  }}
>
Delete Account
</button> */}

    </div>
    
  );
}

export default Dashboard;