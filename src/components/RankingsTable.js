import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { db } from '../firebase.js';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const RankingsTable = (props) => {

    const columns = [
        { dataField: 'name', text: 'Name', sort: true, editable: false, headerStyle: { color: 'white' } },
        {
            dataField: 'wins', text: 'Wins', sort: true, headerStyle: { color: 'white' },
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
            dataField: 'losses', text: 'Losses', sort: true, headerStyle: { color: 'white' },
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

    return (
        <BootstrapTable keyField='name' data={props.data} columns={columns} defaultSorted={defaultSorted} cellEdit={cellEditFactory({ mode: 'click', blurToSave: true, beforeSaveCell })} />
    )
};
export default RankingsTable;