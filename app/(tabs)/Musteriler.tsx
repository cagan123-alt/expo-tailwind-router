import React, { useContext } from 'react'
import { FlatList, Modal, Text, Touchable, TouchableOpacity, View } from 'react-native'
import { SessionContext } from '../../components/SessionProvider'
import { useUsers } from '../../hooks/useUsers'
import { TextInput } from 'react-native'
import { Buffer } from 'buffer'

export default function Musteriler() {
  const {session,users,user_setter} = useContext(SessionContext)
  console.log('Users from Musteriler:', users);


  const [userChange, setUserChange] = React.useState(false)
  const [userChangeState, setUserChangeState] = React.useState()
  const [addedToken, setAddedToken] = React.useState(0)
  const [userDelete, setUserDelete] = React.useState(false)
  const [userDeleteState, setUserDeleteState] = React.useState()



  const handleChange = () => {
    console.log(session)
    console.log(userChangeState)
    console.log(addedToken);
    
    if(!session?.Email || !session?.accessKey || !addedToken){
      return
    }
    if(addedToken <= 0 ){
      return
    }
    const encodedHeader = Buffer.from(`${session.Email}:${session.accessKey}`).toString('base64');
    const addedToken1 = addedToken + userChangeState.Token1;
    console.log(
      {
        Name:userChangeState.Name,
        Surname:userChangeState.Surname,
        PhoneNumber:userChangeState.Phone,
        Token:parseFloat(addedToken1),
      }
    );
    
    fetch("http://192.168.248.193:3873/shop/users",{
      method:"PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": encodedHeader
      },
      body:JSON.stringify(
        {
          Name:userChangeState.Name,
          Surname:userChangeState.Surname,
          PhoneNumber:userChangeState.Phone,
          Token:parseFloat(addedToken1),
        }
      )
    }).then(response => response.json()).then(data => {
      setUserChange(false);
      setUserChangeState(p=>{})
      setAddedToken(0)
      user_setter(data)
    }
    )
    
  }

  const handleDelete = () => {
    if(!session?.Email || !session?.accessKey){
      return
    }
    const encodedHeader = Buffer.from(`${session.Email}:${session.accessKey}`).toString('base64');
    console.log(userDeleteState);
    fetch("http://192.168.248.193:3873/shop/users?name=${}",{
      method:"DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": encodedHeader
      },
      body:JSON.stringify(
        {
          Name:userChangeState.Name,
          Surname:userChangeState.Surname,
          PhoneNumber:userChangeState.Phone,
        }
      )
    }).then(response => response.json()).then(data => {
      setUserChange(false);
      setUserChangeState(p=>{})
      setAddedToken(0)
      user_setter(data)
    }
    )

  }

  
  return (
    <View>
      <FlatList 
      data={users}
      renderItem={({ item }) => {
        
        return(
          <View className='w-full h-36 border border-white'>
            <Text className='text-white'>
              {item.Name} {item.Surname}
            </Text>
            <Text className='text-white'>
              {item.Token1}
            </Text>
            <TouchableOpacity className='bg-red-700' onPress={()=>{
              setUserDelete(true);
              setUserDeleteState(item);
            }}>
              <Text>
                Sil
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className='bg-green-500' onPress={()=>{
              setUserChange(true);
              setUserChangeState(item);
            }}>
              <Text>
                Değiştir
              </Text>
            </TouchableOpacity>
          </View>
        )
      }}
      keyExtractor={(item) => item.UniqueId}

      />

<Modal
  animationType="fade"
  transparent={true}
  visible={userChange}
  onRequestClose={()=>setUserChange(false)}
  >
   
   {/* <TouchableWithoutFeedback onPress={() => setAddMenu(false)}> */}
    <View className='flex-1 justify-center items-center '>
      <View className='flex bg-white w-3/4 h-2/3'>
        <Text className='text-black text-center text-lg'>Kullanıcı Düzenle</Text>
        <View className='flex flex-row gap-4'>
          <Text className='text-black'>Jeton ekle</Text>
          <TextInput keyboardType="numeric" className='border border-black w-full' onChangeText={(text)=>{
            const isValidFloat = /^-?\d*(\.\d+)?$/;
            if (isValidFloat.test(text) || text === "") {
              setAddedToken(parseFloat(text))
            }
          }}/>
          </View>
          
        <TouchableOpacity className='flex bg-blue-500' onPress={handleChange}>
          <Text>Ekle</Text>
        </TouchableOpacity>
        <TouchableOpacity className='flex bg-red-500' onPress={()=>{setUserChange(false);setUserChangeState(p=>{});setAddedToken(0)}}>
          <Text>Vazgeç</Text>
          </TouchableOpacity>

      </View>
    </View>
    {/* </TouchableWithoutFeedback> */}

</Modal>

<Modal
  animationType="fade"
  transparent={true}
  visible={userDelete}
  onRequestClose={()=>setUserDelete(false)}
  >
   
   {/* <TouchableWithoutFeedback onPress={() => setAddMenu(false)}> */}
    <View className='flex-1 justify-center items-center '>
      <View className='flex bg-white w-3/4 h-2/3'>
        <Text className='text-black text-center text-lg'>Kullanıcı Sil</Text>
        <View className='flex gap-4'>
          <Text className='text-black'>Kullanıcının Adı : {userDeleteState?.Name}</Text>
          <Text className='text-black'>Kullanıcının Soyadı : {userDeleteState?.Surname}</Text>
          <Text className='text-black'>Kullanıcının Telefonu : {userDeleteState?.Phone}</Text>
          </View>
        <View className='flex flex-row gap-4'>
          <Text className='text-black'>Dikkat kullanıcının şu kadar jetonu var tüm aldı verdi bitti mi? : {userDeleteState?.Token1}</Text>
          </View>

          
        <TouchableOpacity className='flex bg-blue-500' onPress={handleDelete}>
          <Text>Sil</Text>
        </TouchableOpacity>
        <TouchableOpacity className='flex bg-red-500' onPress={()=>{setUserDelete(false);setUserDeleteState(p=>{})}}>
          <Text>Vazgeç</Text>
          </TouchableOpacity>

      </View>
    </View>
    {/* </TouchableWithoutFeedback> */}

</Modal>
        
    </View>
  )
}
