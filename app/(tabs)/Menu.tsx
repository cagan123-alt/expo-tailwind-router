import React, { useContext } from 'react'
import { FlatList,  Modal,  Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { SessionContext } from '../../components/SessionProvider'
import ReactNativeModal from 'react-native-modal';
import { Buffer } from 'buffer';

type MenuType = {
  ID: number,
  ItemName: string,
  ItemPrice: number
}


export default function Menu() {
  const {menu_type1,session,menu1Setter} = useContext(SessionContext)


  const [addMenu, setAddMenu] = React.useState(false)
  const [addMenuState, setAddMenuState] = React.useState<MenuType>()

  const [editMenu, setEditMenu] = React.useState(false)
  const [editMenuState, setEditMenuState] = React.useState<MenuType>()

  const [deleteMenu, setDeleteMenu] = React.useState(false)
  const [deleteMenuState, setDeleteMenuState] = React.useState<MenuType>()

  const toggleMenu = () => {
    setAddMenu(p=>!p);
  };
  const handleEkle = () => {
    if(!session?.Email || !session?.accessKey || !addMenuState?.ItemName || !addMenuState?.ItemPrice){
      return
    }

    const encodedHeader = Buffer.from(`${session.Email}:${session.accessKey}`).toString('base64');

    fetch("http://192.168.248.193:3873/shop/menu",{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": encodedHeader
      },
      body:JSON.stringify(
        {
          Name:addMenuState.ItemName,
          Price:parseFloat(addMenuState.ItemPrice),
        }
      )
    })
    .then(response => response.json())
    .then(data => {
      setAddMenu(false);
      setAddMenuState(p=>{})
      menu1Setter(data)
    })
    
    
    

  }
  const handleEdit = (item:MenuType) => {
    if(!session?.Email || !session?.accessKey || !editMenuState?.ItemName || !editMenuState?.ItemPrice || !editMenuState?.ID){
      return
    }
    try{
      parseFloat(editMenuState.ItemPrice)
    }
    catch(err){
      console.log('Error:',err);
      return
    }
    const encodedHeader = Buffer.from(`${session.Email}:${session.accessKey}`).toString('base64');

    console.log('EditMenuState:',editMenuState);
    
    fetch(`http://192.168.248.193:3873/shop/menu?id=${editMenuState.ID}`,{
      method:"PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": encodedHeader
      },
      body:JSON.stringify(
        {
          Name:editMenuState.ItemName,
          Price:parseFloat(editMenuState.ItemPrice)
        }
      )
    })
    .then(response => response.json())
    .then(data => {
      setEditMenu(false);
      setEditMenuState(p=>{})
      menu1Setter(data)
    })
  }
  const handleSil = (item:MenuType) => {
    if(!session?.Email || !session?.accessKey || !deleteMenuState?.ID){
      return
    }
    const encodedHeader = Buffer.from(`${session.Email}:${session.accessKey}`).toString('base64');

    fetch(`http://192.168.248.193:3873/shop/menu?id=${deleteMenuState.ID}`,{
      method:"DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": encodedHeader
      },
    })
    .then(response => response.json())
    .then(data => {
      setDeleteMenu(false);
      setDeleteMenuState(p=>{})
      menu1Setter(data)
    })

  
  }
  return (
    <View>
      <FlatList 
        data={menu_type1}
        renderItem={({item}) => {
          return(
            <View className='flex flex-row w-full h-36 border border-white justify-center items-center'>
              <Text className='text-white'>
                {item.ItemName?.toString()}:
              </Text>
              <Text className='text-white'>
                {item.ItemPrice?.toString()}TL
              </Text>
              <View className='flex flex-row gap-1'>
              <TouchableOpacity className='flex bg-green-500' onPress={()=>{
                setEditMenu(true);
                setEditMenuState(item);
              }}>
                <Text>
                Değiştir
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className='flex bg-red-700'
              onPress={()=>{
                setDeleteMenu(true);
                setDeleteMenuState(item);
              
              }}
              >
                <Text>
                Sil
                </Text>
              </TouchableOpacity>
              </View>
            </View>
          ) 
        }}
        keyExtractor={(item) => item.ID?.toString()}
      />
      <TouchableOpacity className='flex bg-blue-500' onPress={()=>setAddMenu(true)}><Text>Ekle</Text></TouchableOpacity>


  <Modal
  animationType="fade"
  transparent={true}
  visible={addMenu}
  onRequestClose={()=>setAddMenu(false)}
  >
   
   {/* <TouchableWithoutFeedback onPress={() => setAddMenu(false)}> */}
    <View className='flex-1 justify-center items-center '>
      <View className='flex bg-white w-3/4 h-2/3'>
        <Text className='text-black text-center text-lg'>Ürün ekle</Text>
        <View className='flex flex-row gap-4'>
          <Text className='text-black'>Ürün Adı:</Text>
          <TextInput className='border border-black w-full' onChangeText={(text)=>setAddMenuState(p=>({...p,ItemName:text}))}/>
          </View>
          <View className='flex flex-row gap-4'>
          <Text className='text-black'>Ürün Fiyatı:</Text>
          <TextInput className='border border-black w-full' onChangeText={(text)=>setAddMenuState(p=>({...p,ItemPrice:text}))}/>
          </View>
        <TouchableOpacity className='flex bg-blue-500' onPress={handleEkle}>
          <Text>Ekle</Text>
        </TouchableOpacity>
        <TouchableOpacity className='flex bg-red-500' onPress={()=>setAddMenu(false)}>
          <Text>Vazgeç</Text>
          </TouchableOpacity>

      </View>
    </View>
    {/* </TouchableWithoutFeedback> */}

  </Modal>
  <Modal
  animationType="fade"
  transparent={true}
  visible={editMenu}
  onRequestClose={()=>setEditMenu(false)}
  >
   
   
    <View className='flex-1 justify-center items-center '>
      <View className='flex bg-white w-3/4 h-2/3'>
        <Text className='text-black text-center text-lg'>Ürünü değiştir</Text>
        <View className='flex flex-row gap-4'>
          <Text className='text-black'>Ürün Adı:</Text>
          <TextInput className='border border-black w-full' value={editMenuState?.ItemName} onChangeText={(text)=>setEditMenuState(p=>({...p,ItemName:text}))}/>
          </View>
          <View className='flex flex-row gap-4'>
          <Text className='text-black'>Ürün Fiyatı:</Text>
          <TextInput className='border border-black w-full' value={editMenuState?.ItemPrice} onChangeText={(text)=>setEditMenuState(p=>({...p,ItemPrice:text}))}/>
          </View>
        <TouchableOpacity className='flex bg-blue-500' onPress={handleEdit}>
          <Text>Değiştir</Text>
        </TouchableOpacity>
        <TouchableOpacity className='flex bg-red-500' onPress={()=>{setEditMenu(false);setEditMenuState(p=>{})}}>
          <Text>Vazgeç</Text>
          </TouchableOpacity>

      </View>
    </View>
    {/* </TouchableWithoutFeedback> */}

  </Modal>
  <Modal
  animationType="fade"
  transparent={true}
  visible={deleteMenu}
  onRequestClose={()=>setDeleteMenu(false)}
  >
   
  
    <View className='flex-1 justify-center items-center '>
      <View className='flex bg-white w-3/4 h-2/3'>
        <Text className='text-black text-center text-lg'>Ürünü sil</Text>
        <View className='flex flex-row gap-4'>
          <Text className='text-black'>Ürün Adı: {deleteMenuState?.ItemName}</Text>
          </View>
          <View className='flex flex-row gap-4'>
          <Text className='text-black'>Ürün Fiyatı: ${deleteMenuState?.ItemPrice}</Text>
          </View>
        <TouchableOpacity className='flex bg-blue-500' onPress={handleSil}>
          <Text>Sil</Text>
        </TouchableOpacity>
        <TouchableOpacity className='flex bg-red-500' onPress={()=>{setDeleteMenu(false);setDeleteMenuState(p=>{})}}>
          <Text>Vazgeç</Text>
          </TouchableOpacity>

      </View>
    </View>
    {/* </TouchableWithoutFeedback> */}

  </Modal>


    </View>
  )
}