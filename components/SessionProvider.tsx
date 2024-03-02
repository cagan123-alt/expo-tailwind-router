import * as React from 'react';
type Session = {
  user: any;
  status: string;
  data: any;
  expiresAt: any;
  accessKey: any;
}

type Menu = {
  ID : number;
  ShopID : number;
  ItemName : string;
  ItemPrice : number;
}

type User = {
  ID: string;
  Name: string;
  Surname: string;
  Token1: number;
}


interface SessionProviderProps {
  children: React.ReactNode;
}

type SessionContextType = React.Context<{
  session: Session;
  menu_type1: Menu[];
  users:User[]
  sessionSetter: (session: Session) => void;
  menu1Setter: (menu_type1: Menu[]) => void;
  user_setter: (users: User[]) => void;
}>;

export const SessionContext: SessionContextType = React.createContext<{
    session: Session;
    menu_type1: Menu[];
    users:User[]
    sessionSetter: (session: Session) => void;
    menu1Setter: (menu_type1: Menu[]) => void;
    user_setter: (users: User[]) => void;
}>({
    session: {
        user: null,
        status: 'loading',
        data: null,
        expiresAt: null,
        accessKey: null,
    },
    menu_type1: [],
    users:[],
    sessionSetter: () => {},
    menu1Setter: () => {},
    user_setter: () => {},
});





export default function SessionProvider ({children} : SessionProviderProps){
  const [session, setSession] = React.useState<Session>({
    user: null,
    status: 'loading',
    data: null,
    expiresAt: null,
    accessKey: null,
  });
  const [menu_type1, setMenu_type1] = React.useState<Menu[]>([]);
  const [users, setUsers] = React.useState([]);

  const sessionSetter = (session: Session) => {
    setSession(session)
  }
  const menu1Setter = (menu_type1: Menu[]) => {
    setMenu_type1(menu_type1)
  }
  const user_setter = (users: any) => {
    setUsers(users)
  }

  return (
    <SessionContext.Provider value={{session, sessionSetter,menu1Setter,menu_type1,users,user_setter}}>
      {children}
    </SessionContext.Provider>
  )
}
