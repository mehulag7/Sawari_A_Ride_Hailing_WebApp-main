import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { CaptainDataContext } from "../context/captainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainSignup = () => {
        const navigate = useNavigate();

    const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [firstName, setfirstName] = useState("");
        const [lastName, setlastName] = useState("");
        const [vehicleColor, setVehicleColor] = useState("");
        const [vehiclePlate, setVehiclePlate] = useState("");
        const [vehicleCapacity, setVehicleCapacity] = useState("");
        const [vehicleType, setVehicleType] = useState("");

        const {captain, setCaptain}= React.useContext(CaptainDataContext);
    
        const submitHandler = async (e) => {
            e.preventDefault();
            const captainData={
                fullname:{
                firstname: firstName,
                lastname: lastName
                },
                email: email,
                password: password,
                vehicle: {
                    color: vehicleColor,
                    plate: vehiclePlate,
                    capacity: vehicleCapacity,
                    vehicleType: vehicleType
                }
            };

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData);

            if (response.status === 201) {
                const data = response.data;
                setCaptain(data.captain);
                localStorage.setItem('token', data.token);
                navigate('/captain-home');
            }

            setEmail("");
            setPassword("");
            setfirstName("");   
            setlastName("");
            setVehicleColor("");
            setVehiclePlate("");
            setVehicleCapacity("");
            setVehicleType("");
        }

    return (
        <div className="pl-7 pb-7 pr-7 pt-3 flex flex-col justify-between h-screen">
            <div>
                <img className="w-16 mb-3"  src="https://pngimg.com/d/uber_PNG24.png" alt="" />
            <form action="" onSubmit={(e)=>{submitHandler(e)}}>
                <h3 className="text-base mb-2 font-medium">What's our Captain's name</h3>
                <div className="flex gap-2 mb-5">
                    <input className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 text-base placeholder:text-sm " value={firstName} onChange={(e)=>{setfirstName(e.target.value)}} required type="test" placeholder="firstName" />
                    <input className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 text-base placeholder:text-sm " value={lastName} onChange={(e)=>{setlastName(e.target.value)}} type="text" placeholder="lastName" />
                </div>
                <h3 className="text-base mb-2 font-medium">What's our Captain's email</h3>
                <input className="bg-[#eeeeee] rounded px-4 py-2 w-full text-base placeholder:text-sm mb-5" value={email} onChange={(e)=>{setEmail(e.target.value)}} required type="email" placeholder="example@email.com" />
                <h3 className="text-base mb-2 font-medium">Enter Password</h3>
                <input className="bg-[#eeeeee] rounded px-4 py-2  w-full text-base placeholder:text-sm mb-5" value={password} onChange={(e)=>{setPassword(e.target.value)}} required type="password" placeholder="password"/>
                <h3 className="text-base mb-2 font-medium">Vehicle Information</h3>
                <div className="flex gap-2 mb-5">
                    <input
                        className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 text-base placeholder:text-sm"
                        value={vehicleColor}
                        onChange={(e) => setVehicleColor(e.target.value)}
                        required
                        type="text"
                        placeholder="Vehicle Color"
                    />
                    <input
                        className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 text-base placeholder:text-sm"
                        value={vehiclePlate}
                        onChange={(e) => setVehiclePlate(e.target.value)}
                        required
                        type="text"
                        placeholder="Vehicle Plate"
                    />
                </div>
                <div className="flex gap-2 mb-5">
                    <input
                        className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 text-base placeholder:text-sm"
                        value={vehicleCapacity}
                        onChange={(e) => setVehicleCapacity(e.target.value)}
                        required
                        type="number"
                        min="1"
                        placeholder="Capacity"
                    />
                    <select
                        className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 text-base placeholder:text-sm"
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="car">Car</option>
                        <option value="auto">Auto</option>
                        <option value="bike">Bike</option>
                    </select>
                </div>
                <button className="bg-[#111] text-white font-semibold rounded px-4 py-2 w-full text-lg placeholder:text-base mb-3">Create Account</button>
            </form>
            <p className="text-center mb-2">Already have an account? <Link to='/captain-login' className="text-blue-600">Login</Link></p>
                
            </div>
            
            <div>
            <p className="text-xs text-gray-400 leading-tight">By proceeding, you consent to get calls, WhatsApp or SMS messages, including by automated dialer, from Uber and its affiliates to the number provided.
            </p>
            </div>
        </div>
    )
}

export default CaptainSignup;   