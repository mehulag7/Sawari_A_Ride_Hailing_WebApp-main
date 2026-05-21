import React, { useState, useEffect } from 'react'
import { CaptainDataContext } from '../context/captainContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CaptainProtectedWrapper = ({ children }) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [isLoading, setisLoading] = useState(true);
    const { setCaptain } = React.useContext(CaptainDataContext);

    useEffect(() => {
        if (!token) {
            navigate('/captain-login');
            return;
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.status === 200) {
                setCaptain(response.data.captain);
                setisLoading(false);
            }
        }).catch((error) => {
            console.error("Error fetching captain profile:", error);
            setisLoading(false);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                navigate('/captain-login');
            }
        });
    }, [token, navigate, setCaptain]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return <>{children}</>
}

export default CaptainProtectedWrapper