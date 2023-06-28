import { db } from '../firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const TitleTable = (props) => {
    const { name, data } = props;

    const [tableData, setTableData] = useState({})

    useEffect(() => {
        (async function () {
            const docRef = doc(db, "titles", data);
            const docSnap = await getDoc(docRef);


            if (docSnap.exists()) {
                setTableData(docSnap.data());
            }
            else {
                console.log("That belt doesn't exist... yet...");
            }
        })();
    }, []);

    return (
        <div>
            <p>{name}</p>
            <p>{JSON.stringify(tableData)}</p>
        </div>
    );
}

export default TitleTable;