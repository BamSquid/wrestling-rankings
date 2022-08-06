import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import RankingsTable from './components/RankingsTable';
import { db } from './firebase.js';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import DeleteIcon from '@mui/icons-material/Delete';
import './App.css';

const q = query(collection(db, 'users'), orderBy('updated_date', 'desc'));

function App() {
  const [users, setUsers] = useState([]);
  const [fields, setInput] = useState({
    name: '',
    wins: '',
    losses: ''
  });
  const [showDelete, setShowDelete] = useState(true);

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
    document.getElementsByClassName('add-user')[0].style['display'] = 'none';
  };

  function showAddUserForm(e) {
    e.preventDefault();
    const userForm = document.getElementsByClassName('add-user')[0];
    if(userForm.style['display'] === 'none') {
      userForm.style['display'] = 'block';
    }
    else {
      userForm.style['display'] = 'none';
    }
  };

  return (
    <div className="App">
      <h2>Wrestling Rankings</h2>
      <br />
      <RankingsTable
        headers={[{ dateField: 'name', text: 'Name' }, 'Wins', 'Losses', 'Total Matches', 'Win Rate']}
        data={users.map(user => ({ ...user, name: user.item.name, wins: user.item.wins, losses: user.item.losses, total: user.item.wins + user.item.losses, win_rate: (user.item.wins + user.item.losses) === 0 ? 0 : (user.item.wins / (user.item.wins + user.item.losses) * 100).toFixed(2), delete: <DeleteIcon fontSize="small" style={{ opacity: 0.7 }} onClick={() => { deleteDoc(doc(db, 'users', user.id)) }} /> }))}
        showDelete={showDelete}
      />
      <Button color="secondary" variant="contained" onClick={showAddUserForm}>Add User</Button>
      <Button color="warning" variant="contained" onClick={() => setShowDelete(!showDelete)}>{showDelete ? 'Show' : 'Hide'} Delete</Button>
      <div className="add-user" style={{display: 'none'}}>
        <form>
          <TextField id="outlined-basic1" label="Name" name="name" variant="outlined" style={{ margin: "0px 5px" }} size="small" value={fields.name}
            onChange={e => setInput({ ...fields, [e.target.name]: e.target.value })} />
          <TextField id="outlined-basic2" label="Wins" name="wins" variant="outlined" style={{ margin: "0px 5px" }} size="small" value={fields.wins}
            onChange={e => setInput({ ...fields, [e.target.name]: e.target.value })} />
          <TextField id="outlined-basic3" label="Losses" name="losses" variant="outlined" style={{ margin: "0px 5px" }} size="small" value={fields.losses}
            onChange={e => setInput({ ...fields, [e.target.name]: e.target.value })} />
          <Button variant="contained" color="primary" onClick={addUser}>Add User</Button>
        </form>
      </div>
    </div>
  );
}
export default App;