import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { getToken, removeToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', category: '', difficulty_level: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await API.get('/skills', {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        setSkills(res.data);
      } catch (err) {
        setMessage('Please login again.');
        removeToken();
        navigate('/login');
      }
    };
    fetchSkills();
  }, [navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/skills', form, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setMessage('Skill added!');
      setForm({ name: '', description: '', category: '', difficulty_level: '' });
      // Refresh skills
      const res = await API.get('/skills', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setSkills(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add skill');
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <h3>Add Skill</h3>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Skill Name" value={form.name} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input name="difficulty_level" placeholder="Difficulty (Beginner/Intermediate/Advanced)" value={form.difficulty_level} onChange={handleChange} />
        <button type="submit">Add Skill</button>
      </form>
      <p>{message}</p>
      <h3>Your Skills</h3>
      <ul>
        {skills.map(skill => (
          <li key={skill._id}>{skill.name} ({skill.difficulty_level})</li>
        ))}
      </ul>
    </div>
  );
}
