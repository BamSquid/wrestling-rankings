import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { db } from '../firebase.js';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { collection, query, orderBy, onSnapshot, deleteDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

const RankingsTable = (props) => {

    
const q = query(collection(db, `users/${props.year}/standings`), orderBy('updated_date', 'desc'));

    const [users, setUsers] = useState([]);
    const [data, setData] = useState([]);

    const columns = [
        { dataField: 'name', text: 'Name', sort: true, editable: false, headerStyle: { color: 'white' } },
        {
            dataField: 'wins', text: 'Wins', sort: true, editable: props.isEditable, headerStyle: { color: 'white' },
            validator: (newValue, row, column) => {
                if (isNaN(newValue)) {
                    return {
                        valid: false,
                        message: 'Wins should be numeric'
                    };
                }
                return true;
            }
        },
        {
            dataField: 'losses', text: 'Losses', sort: true, editable: props.isEditable, headerStyle: { color: 'white' },
            validator: (newValue, row, column) => {
                if (isNaN(newValue)) {
                    return {
                        valid: false,
                        message: 'Losses should be numeric'
                    };
                }
                return true;
            }
        },
        { dataField: 'total', text: 'Total Matches', sort: true, editable: false, headerStyle: { color: 'white' }, },
        {
            dataField: 'win_rate', text: 'Win Rate', sort: true, editable: false, headerStyle: { color: 'white' }, sortFunc: (a, b, order, dataField) => {
                if (order === 'asc') {
                    return parseFloat(b) - parseFloat(a);
                }
                return parseFloat(a) - parseFloat(b); // desc
            }
        },
        { dataField: 'delete', text: 'Delete', hidden: props.showDelete, editable: false, headerStyle: { color: 'white' } }
    ];

    const defaultSorted = [{
        dataField: 'win_rate',
        order: 'asc'
    }];

    function beforeSaveCell(oldValue, newValue, row, column, done) {
        const data = {
            [column.dataField]: parseInt(newValue),
            updated_date: serverTimestamp()
        };

        const docRef = doc(db, `users/${props.year}/standings`, row.id);
        updateDoc(docRef, data);
    }

    useEffect(() => {
        onSnapshot(q, (snapshot) => {
          setUsers(snapshot.docs.map(doc => ({
            id: doc.id,
            item: doc.data()
          })
          ));
          setData(users.map(user => ({ ...user, name: user.item.name, wins: user.item.wins, losses: user.item.losses, total: user.item.wins + user.item.losses, win_rate: (user.item.wins + user.item.losses) === 0 ? 0 : (user.item.wins / (user.item.wins + user.item.losses) * 100).toFixed(2), delete: <DeleteIcon fontSize="small" style={{ opacity: 0.7 }} onClick={() => { deleteDoc(doc(db, `users/${props.year}/standings`, user.id)) }} /> })));
        });
      });

    return (
        <BootstrapTable keyField='name' data={data} columns={columns} defaultSorted={defaultSorted} cellEdit={cellEditFactory({ mode: 'click', blurToSave: true, beforeSaveCell })} />
    )
};
export default RankingsTable;