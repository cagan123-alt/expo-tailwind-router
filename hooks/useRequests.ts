import { useEffect, useState } from "react";
import { Firebase_db } from "../Firebase_Config";
import { ref, onValue } from "firebase/database";

export const useRequests = ({session}) => {
    const currentUser = session
    const [requests, setRequests] = useState([]);    
    
    useEffect(() => {
        if (!session || !session.ID) return;

        const requestRef = ref(Firebase_db, `requests/${currentUser.ID}`);
        
        const unsubscribe = onValue(requestRef, (snapshot) => {
            const returnVal = [];
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                const key = childSnapshot.key;
                returnVal.push({
                    user: key,
                    item: childData,
                });
            });
            setRequests(p=>[...returnVal]);
        }
        );
        return () => unsubscribe()
       

    }, [session]);


    return requests;
}
