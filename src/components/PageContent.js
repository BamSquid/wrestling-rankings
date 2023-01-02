import { db } from '../firebase.js';
import { doc } from 'firebase/firestore';
import { collection, query, orderBy, onSnapshot, deleteDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import RankingsTable from './RankingsTable.js';
import { useParams } from 'react-router-dom';

const PageContent = (props) => {

    const {year} = useParams();
    const q = query(collection(db, `users/${year}/standings`), orderBy('updated_date', 'desc'));
    const [users, setUsers] = useState([]);

    useEffect(() => {
        onSnapshot(q, (snapshot) => {
            setUsers(snapshot.docs.map(doc => ({
                id: doc.id,
                item: doc.data()
            })
            ));
        });
    });

    return (
        <div id={year + 'pageContent'}>
            <RankingsTable
                year={year}
                data={users.map(user => ({ ...user, name: user.item.name, wins: user.item.wins, losses: user.item.losses, total: user.item.wins + user.item.losses, win_rate: (user.item.wins + user.item.losses) === 0 ? 0 : (user.item.wins / (user.item.wins + user.item.losses) * 100).toFixed(2), delete: <DeleteIcon fontSize="small" style={{ opacity: 0.7 }} onClick={() => { deleteDoc(doc(db, `users/${year}/standings`, user.id)) }} /> }))}
                showDelete={props.showDelete}
                isEditable={props.isEditable}
            />
            {/* <TitleTable
                name='AEW Championship'
                data={titleData['aew-championship']}
            />
            <TitleTable 
                name='Bullet Club Belt'
                data={titleData['bullet-club-belt']}
            />
            <TitleTable 
                name='NXT Championship'
                data={titleData['nxt-championship']}
            />
            <TitleTable 
                name='Money in the Bank'
                data={titleData['money-in-the-bank']}
            /> */}
        </div>

    )

};
export default PageContent;