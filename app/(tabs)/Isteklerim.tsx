import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import { useRequests } from '../../hooks/useRequests';
import { useContext } from 'react';
import { SessionContext } from '../../components/SessionProvider';

export default function Isteklerim() {

  const {session} = useContext(SessionContext)
  console.log('Session:', session);
  const requests = useRequests({session})
  

  


  
  return (
    <View  className='flex bg-blue-700'>
    <FlatList
      data={requests}
      renderItem={({ item }) => {        
        return(
        <View className='w-full h-36 border border-white flex items-center'>
          <Text>
            {item.user.split("-")[0].replace(","," ")}
          </Text>
          <Text>
          { new Date(item.item.date).toLocaleDateString()}
          </Text>
          <View className='flex flex-row gap-1'>
          <TouchableOpacity className='flex bg-green-500'>
            <Text>
              Tamamla
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className='flex bg-red-700'>
            <Text>
              Iptal
            </Text>
          </TouchableOpacity>
          </View>
        </View>
      )}}
      keyExtractor={(item) => item.user}
    />
    
  </View>
  )
}

