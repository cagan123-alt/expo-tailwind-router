import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import { useContext, useEffect, useState } from 'react';
import { Redirect, router } from 'expo-router';
import { SessionContext } from '../../components/SessionProvider';
import { useOrders } from '../../hooks/useOrders';
import { Firebase_db } from '../../Firebase_Config';
import { ref,get, child, update, remove } from 'firebase/database';

export default function TabOneScreen() {
  const {session} = useContext(SessionContext)
  if(!session?.ID){
    return <Redirect href="/Giris"/>
  }
  const orders = useOrders({session});
  useEffect(() => {
    console.log('Orders updated:', orders);
  }, [orders]);
  

  const handleTamamla = (order) => {
    //from database change the orders status to 1 if status is already 1 then delete it 
    
    get(child(ref(Firebase_db),`orders/${session.ID}/${order.user}/${order.item.name}`)).then((snapshot) => {
      console.log("snapshot",snapshot.val())
      
      if(snapshot.exists()){
        console.log("exists");
        if(snapshot.val().userStatus === 1){
          remove(ref(Firebase_db,`orders/${session.ID}/${order.user}/${order.item.name}`))
        }
        else{
          console.log("status is not 1");
          //change status to 1
          const updatedStatus = snapshot.val().magazaStatus === 1 ? 0 : 1;
          update(ref(Firebase_db,`orders/${session.ID}/${order.user}/${order.item.name}`),{
            magazaStatus:updatedStatus
          })

        }
      }
    })

   
  }
  const handleIptal = (order) => {
    console.log('Iptal:', order);
  }

  
  
  return (
    <View  className='flex bg-blue-700'>
      <FlatList
        data={orders}
        renderItem={({ item }) => {
          
          return(
          <View className='w-full h-36 border border-white flex items-center'>
            {
              //item.user is like this Aslan,Demir replace , with space

            }
            <Text className='text-white'>{item.user.split("-")[0].replace(","," ")}</Text>
            <Text className='text-white'>{item.item.name}:{item.item.details.count}</Text>
            <View className='flex flex-row  gap-1'>
            <TouchableOpacity className={`${item.item.details.magazaStatus === 1 ? "bg-blue-400":"bg-green-400"}`} onPress={()=>{handleTamamla(item)}}>
              <Text className='text-white'>
                {item.item.details.magazaStatus === 1 ? "Müşteri Bekleniyor":"Tamamla"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{
              handleIptal(item)
            }} className='bg-red-400'>
              <Text className='text-white'>İptal</Text>
            </TouchableOpacity>
            </View>
          </View>
        )}}
        keyExtractor={(item) => item.user+item.item.name}
      />
      
    </View>
  );
}


