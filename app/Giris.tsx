import React, { useContext, useEffect } from 'react'
import { ActivityIndicator, Button, TextInput, View,Text, Alert } from 'react-native'
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { SessionContext } from '../components/SessionProvider';
import { z } from 'zod';
import sha512 from '../lib/sha512';
import Checkbox from 'expo-checkbox';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { setCurrentUser } from '../hooks/setCurrentUser';
import { Buffer } from 'buffer';
export default function LoginScreen() {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [checked, setChecked] = React.useState(false);
    const {session,sessionSetter,menu1Setter,user_setter}= useContext(SessionContext)
    
    
    
    const handleSubmit = async () => {
        console.log("hello");
        setLoading(true);
        try{
            z.object({
                email: z.string().email(),
                password: z.string().min(6)
            }).parse({email,password})
        }
        catch(err){
            setLoading(false)
            return
        }
        console.log(email,password);
        
        const hashedPassword = await sha512(password);
        console.log(JSON.stringify({
            Email:email,
            Password:hashedPassword,
            WantSession: checked,
        }));
        
        
         fetch(`http://192.168.248.193:3873/shop/auth`,{
             method:"POST",
             headers: {
                 "Content-Type": "application/json"
             },
             body:JSON.stringify({
                 Email:email,
                 Password:hashedPassword,
                 WantSession: checked,
             })
         }).then((response) => {
            console.log(response.status);
            
                if(response.status === 200){
                    return response.json()}
                }
         ).
         then((response) => {
            //decode the response from base64 then json it 
           
            const debugedRes = Buffer.from(response.userInfo, 'base64').toString('utf-8');
            const setSes =JSON.parse(debugedRes)
            console.log(response,"response")
            sessionSetter({...setSes,accessKey:response.accessKey});
            const debugedMenu = Buffer.from(response.menuItems_type1, 'base64').toString('utf-8');
            console.log(debugedMenu,"menu");
            const setMenu =JSON.parse(debugedMenu)
            console.log(setMenu,"menu");
            menu1Setter(setMenu);
            const users = Buffer.from(response.shop1Users, 'base64').toString('utf-8');
            console.log(users,"users");
            const setUsers =JSON.parse(users)
            user_setter(setUsers);
            router.push('/(tabs)');
                            
         }).     
         catch((err) => {
             console.log(err);
         })
        // .then((response) => {
        //     // if(response.status === 200){
        //     //     return response.json()
        //     // }
        //     // else{
        //     //     throw new Error('Invalid credentials')
        //     // }
        //     console.log(response);
        // })
        // // .then(response=>{
        // //     console.log(response);
        // //     SecureStore.setItemAsync('session',response.session).then(()=>{
        // //         SecureStore.setItemAsync('email',email).then(()=>{
        // //             setSession({
        // //                 user: email,
        // //                 status: 'authenticated',
        // //                 data: response
        // //             })
        // //         })
        // //     })
        // // })
        // // .catch(err=>{
        // //     setError(err.message)
        // // })
         .finally(()=>{
             setLoading(false)
         })
}
useEffect(()=>{
    SecureStore.getItemAsync('session').then((session) => {
        if(!session){
            return
        }else{
            SecureStore.getItemAsync('email').then((email) => {
            if(!email) return
            fetch(`${Constants?.expoConfig?.extra?.STORE_VALIDATE_SERVER_URL}`,{
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify({
                    Email: email,
                    Session: session
                })
            }).then((response) => {
                if(response.status === 200){
                    return response.json()
                }
            }).then(response=>{
                console.log(response);
            })
        })
    
        }
    }
)
},[])

    return (
        <View className={`flex flex-1 items-center justify-center bg-white`}>
            <View className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 ">
                <TextInput
                    className={`mb-4 px-3 py-2 border text-black rounded  leading-tight focus:outline-none focus:shadow-outline`}
                    placeholder='Email'
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor={'#4a5568'} // Tailwind gray-400 and gray-700
                />
                <TextInput
                    className={`mb-2 px-3 py-2 border text-black rounded  leading-tight focus:outline-none focus:shadow-outline`}
                    placeholder='Şifre'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor={'#4a5568'} // Tailwind gray-400 and gray-700
                />
                 <TouchableOpacity onPress={()=>setChecked(p=>!p)} style={{ flexDirection: 'row', alignItems: 'center' }} activeOpacity={1}>
      <Checkbox value={checked} />
      <Text style={{ marginLeft: 8 }}>Beni Hatırla</Text>
    </TouchableOpacity>
                
                {
                    error &&

                    // ...

                    <Text style={{ fontSize: 12, fontStyle: 'italic', marginBottom: 4, color:  'darkred' }}>{error}</Text>
                }
                {
                    loading
                        ? <ActivityIndicator className="mb-4" />
                        : <Button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded `} title='Giriş' onPress={handleSubmit} />
                }
            </View>
        </View>
    );
}
