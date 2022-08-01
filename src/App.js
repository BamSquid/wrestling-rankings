import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import User from './components/User';
import { db } from './firebase.js';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import './App.css';

const q = query(collection(db, 'users'), orderBy('updated_date', 'desc'));

function App() {
  const [users, setUsers] = useState([]);
  const [fields, setInput] = useState({
    name: '',
    wins: '',
    losses: ''
  });

  useEffect(() => {
    onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({
        id: doc.id,
        item: doc.data()
      })
      ));
    });
  }, [fields]);

  const addUser = (e) => {
    e.preventDefault();
    addDoc(collection(db, 'users'), {
      name: fields.name,
      wins: parseInt(fields.wins),
      losses: parseInt(fields.losses),
      updated_date: serverTimestamp()
    });
    setInput({
      name: '',
      wins: '',
      losses: ''
    });
  };

  return (
    <div className="App">
      <h2>Add New User Stats</h2>
      <form>
        <TextField id="outlined-basic1" label="Name" name="name" variant="outlined" style={{ margin: "0px 5px" }} size="small" value={fields.name}
          onChange={e => setInput({ ...fields, [e.target.name]: e.target.value })} />
        <TextField id="outlined-basic2" label="Wins" name="wins" variant="outlined" style={{ margin: "0px 5px" }} size="small" value={fields.wins}
          onChange={e => setInput({ ...fields, [e.target.name]: e.target.value })} />
        <TextField id="outlined-basic3" label="Losses" name="losses" variant="outlined" style={{ margin: "0px 5px" }} size="small" value={fields.losses}
          onChange={e => setInput({ ...fields, [e.target.name]: e.target.value })} />
        <Button variant="contained" color="primary" onClick={addUser}>Add User</Button>
      </form>
      <ul>
        {users.sort((a, b) => (b.item.wins / (b.item.wins + b.item.losses)) - (a.item.wins / (a.item.wins + a.item.losses)))
        .map(item => <User key={item.id} arr={item} />)}
      </ul>
    </div>
  );
}
export default App;