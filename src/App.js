import React, { useState } from 'react';
import { TextField, Button, InputLabel, Select, MenuItem } from '@mui/material';
import { db } from './firebase.js';
import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl } from '@mui/material'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css';
import PageContent from './components/PageContent';

const currYear = new Date().getFullYear();

function App() {

  const getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  };

  const setCookie = (cname, cvalue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  };

  const [fields, setInput] = useState({
    name: '',
    wins: 0,
    losses: 0
  });
  const [showDelete, setShowDelete] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [year, setYear] = useState(currYear);
  const [isAdmin, setIsAdmin] = useState(getCookie('isAdmin') === 'true');
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');

  const addUser = (e) => {
    e.preventDefault();

    setDoc(doc(db, `users/${year}/standings/`, fields.name.toLowerCase()), {
      name: fields.name,
      wins: parseInt(fields.wins),
      losses: parseInt(fields.losses),
      updated_date: serverTimestamp()
    })

    setInput({
      name: '',
      wins: 0,
      losses: 0
    });

    setShowAddUser(!showAddUser);
  };

  const selectYear = (event) => {
    setYear(event.target.value);
    setShowAddUser(false);
    setShowDelete(true);
  };

  const handleClickOpen = () => {
    if (isAdmin) {
      setIsAdmin(false);
      setCookie('isAdmin', false, 365);
      setShowAddUser(false);
      setShowDelete(true);
    }
    else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const checkPassword = () => {
    let check = password === 'updateLater';
    setIsAdmin(check);
    setCookie('isAdmin', check, 365);
    handleClose();
  };

  const keyPress = (e) => {
    e.keyCode === 13 && checkPassword();
  };

  const updateYearFromUrl = (newYear) => {
    setYear(newYear);
  };

  let menuItems = [];
  for (let i = 2021; i <= currYear; i++) {
    menuItems.push(<MenuItem value={i}><Link style={{ 'textDecoration': 'none' }} to={`/year/${i}`}>{i}</Link></MenuItem>)
  }

  return (
    <div className="App">
      <div id="header-toolbar">
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small" id='yearDropdown'>
          <InputLabel id="year-select-label">Year</InputLabel>
          <Select
            labelId="year-select-label"
            id="year-select"
            value={year}
            label="Year"
            onChange={selectYear}
          >
            {menuItems}
          </Select>
        </FormControl>
        <div id="admin-tools" style={{ display: isAdmin && year === currYear ? "block" : "none" }}>
          <Button color="secondary" variant="contained" onClick={() => setShowAddUser(!showAddUser)}>{showAddUser ? 'Hide' : 'Show'} Add User</Button>
          <Button color="warning" variant="contained" onClick={() => setShowDelete(!showDelete)}>{showDelete ? 'Show' : 'Hide'} Delete</Button>
        </div>
        <Button className="admin-login" color="primary" variant="contained" onClick={handleClickOpen}>{isAdmin ? 'Logout' : 'Login'}</Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Admin Login</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the admin password to enable data editing
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="password"
              label="password"
              type="password"
              fullWidth
              variant="standard"
              onChange={e => setPassword(e.target.value)}
              onKeyUp={keyPress}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={checkPassword} type='submit'>Submit</Button>
          </DialogActions>
        </Dialog>
      </div>
      <h2>Wrestling Rankings</h2>
      <br />
      <Routes>
        <Route
          path='year/:year'
          element={
            <PageContent
              isEditable={year === currYear && isAdmin}
              showDelete={showDelete}
              updateYearFromUrl={updateYearFromUrl}
            />
          }
        />
        <Route
          path='*'
          element={
            <Navigate
              to={`/year/${currYear}`}
              replace />
          }
        />
      </Routes>

      <div className="add-user" style={{ display: showAddUser && year === currYear ? 'block' : 'none' }}>
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