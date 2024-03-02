type Session = {
    user: any;
    status: string;
    data: any;
    expiresAt: any;
}
export const setCurrentUser = (currentUser :Session) => {
    //Save this to safe storage 
    console.log('Setting current user', currentUser)
    SecureStore.setItemAsync('expireable-session',currentUser.session).then(()=>{
        SecureStore.setItemAsync('email',currentUser.user).then(()=>{
            setSession({
                user: currentUser.user,
                status: 'authenticated',
                data: currentUser
            })
        })
    })
        
}
