import { List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { db } from '../firebase.js';
import { doc, deleteDoc } from "firebase/firestore";
import './todo.css'

const User = ({ arr }) => {
    return (
        <List className="user__list">
            <ListItem>
                <ListItemAvatar />
                <ListItemText primary={arr.item.name} />
                <ListItemText primary={arr.item.wins}/>
                <ListItemText primary={arr.item.losses} />
                <ListItemText primary={arr.item.wins + arr.item.losses} />
            </ListItem>
            <DeleteIcon fontSize="large" style={{ opacity: 0.7 }} onClick={() => { deleteDoc(doc(db, 'users', arr.id)) }} />
        </List>
    )
};
export default User;