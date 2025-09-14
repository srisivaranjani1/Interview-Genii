import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Meetings.css';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [form, setForm] = useState({
    title: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    calendarType: 'Personal',
    phone: '',
    email: '',
    notificationType: 'Email',
    reminderMinutes: 15,
    id: null,
  });

  const fetchMeetings = async () => {
    const res = await axios.get('https://mockinterview-2-gxs9.onrender.com/api/meetings');
    setMeetings(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.id) {
      await axios.put(`https://mockinterview-2-gxs9.onrender.com/api/meetings/${form.id}`, form);
    } else {
      await axios.post('https://mockinterview-2-gxs9.onrender.com/api/meetings', form);
    }
    setForm({
      title: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      location: '',
      calendarType: 'Personal',
      phone: '',
      email: '',
      notificationType: 'Email',
      reminderMinutes: 15,
      id: null,
    });
    fetchMeetings();
  };

  const handleEdit = (meeting) => {
    setForm({ ...meeting, id: meeting._id });
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://mockinterview-2-gxs9.onrender.com/api/meetings/${id}`);
    fetchMeetings();
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    <div className="meetings">
      <div className="container">
        <div className="formContainer">
          <form onSubmit={handleSubmit}>
          <h2>Schedule a Meeting</h2>
            <input placeholder="Meeting Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
            <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
            <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} />
            <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} />
            <input placeholder="Location or Link" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            <select value={form.calendarType} onChange={e => setForm({ ...form, calendarType: e.target.value })}>
              <option>Personal</option>
              <option>Work</option>
            </select>
            <input placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <select value={form.notificationType} onChange={e => setForm({ ...form, notificationType: e.target.value })}>
              <option>SMS</option>
              <option>Email</option>
            </select>
            <input type="number" placeholder="Reminder Minutes" value={form.reminderMinutes} onChange={e => setForm({ ...form, reminderMinutes: parseInt(e.target.value) })} />
            <button type="submit">{form.id ? "Update" : "Schedule"} Meeting</button>
          </form>
        </div>

        <div className="meetingListContainer">
          <h2>Scheduled Meetings</h2>
          {meetings.map(m => (
            <div key={m._id} className="meetingCard">
              <h3>{m.title}</h3>
              <p>📅 {new Date(m.startDateTime).toLocaleString()}</p>
              <p>⏰ {m.startTime} - {m.endTime}</p>
              <button onClick={() => handleEdit(m)}>Edit</button>
              <button onClick={() => handleDelete(m._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Meetings;

