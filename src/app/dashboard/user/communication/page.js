import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import React from 'react';
import paidBooking from './payedBooking/paidBooking';
import ChatSystem from './components/ChatSystem';

const communication = async () => {
    const {user} = await getServerSession(authOptions);
    const result = await paidBooking(user?.email);
    return (
        <div>
            <ChatSystem result={result} />
        </div>
    );
};

export default communication;