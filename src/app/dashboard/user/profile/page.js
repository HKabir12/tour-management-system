import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import React from 'react';
import UserPhoto from './component/UserPhoto';

const profile = async () => {
    const data = await getServerSession(authOptions);
    const res = await fetch(`https://tour-management-system-team-ultimat-tan.vercel.app/api/allUsers/${data?.user?.email}`,{cache: "force-cache"});
    const resultUser = await res.json();
    
    return (
        <div className="bg-gray-100">
            <UserPhoto resultUser={resultUser} />
            
        </div>
    );
};

export default profile;