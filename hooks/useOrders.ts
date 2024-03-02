import { useEffect, useState } from "react";
import { Firebase_db } from "../Firebase_Config";
import { ref, onValue } from "firebase/database";

export const useOrders = ({session}) => {
    try{
    const currentUser = session;
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!currentUser || !currentUser.ID ) return;
        const orderRef = ref(Firebase_db, `orders/${currentUser.ID}`);
        
        let temp = {};
        const returnVal = [];
        const unsubscribe = onValue(orderRef, (snapshot) => {
            
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                const key = childSnapshot.key;
                temp[key] = childData;
            });
            Object.keys(temp).forEach((value) => {
                Object.keys(temp[value]).forEach((item) => {
                    returnVal.push({
                        user: value,
                        item: {
                            name: item,
                            details: temp[value][item],
                        },
                    });
                });
            });
            setOrders(p=>[...returnVal]);
            temp = {};
            returnVal.length = 0;
        });

        return () => unsubscribe();
    }
    , [session]);
    
    return orders;
    

//     useEffect(() => {
//         if (!currentUser || !currentUser.dealerId || !Array.isArray(currentUser.tables)) return;
//         console.log('Current User:', currentUser);
// if (currentUser) {
//   console.log('Dealer ID:', currentUser.dealerId);
//   console.log('Tables:', currentUser.tables);
// }

//         const starCountRef = ref(Firebase_db, `${currentUser.id}`);
//         let temp ={}
//         const unsubscribe = onValue(starCountRef, (snapshot) => {
//             snapshot.forEach((childSnapshot) => {
//                 const childData = childSnapshot.val();
//                 const key = childSnapshot.key;
                
//                 if(currentUser.tables.includes(parseInt(key, 10))){                    
//                     console.log(childData, childSnapshot.key);
//                     temp[childSnapshot.key] = childData;
//                 }
//             }
//             );
//             Object.keys(temp).forEach((value) => {
//                 //order them according to lastUpdate 
//                 const tempArray = Object.values(temp);
//                 tempArray.sort((a,b) => {
//                     const dateA = new Date(a.lastUpdate);
//                     const dateB = new Date(b.lastUpdate);
//                     return dateB - dateA;
//                 });
//                 temp = tempArray;
//             }
//             );
//             setTables(temp);
            
            
//             temp = {};
//         });
        

//         return () => unsubscribe();
//     }, [currentUser]);


//     return tables;}
//     catch (error) {
//         console.log(error);
    }catch (error) {
        console.log(error);
    }

};
