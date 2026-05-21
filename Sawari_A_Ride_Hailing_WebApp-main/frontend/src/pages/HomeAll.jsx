import React from "react";
import { Link } from "react-router-dom";

const HomeAll = () => {
    return (
        <div>
            <div className="h-screen pt-8 w-full flex justify-between flex-col bg-[url('/traffic-light-home.jpg')] bg-cover bg-center">
                <img className="w-16 ml-8" src="https://freelogopng.com/images/all_img/1659768779uber-logo-white.png" alt="" />
                <div className="bg-white py-4 px-4 pb-7">
                    <h2 className="text-3xl font-bold">Get Started with Uber</h2>
                    <Link to='/login' className="flex items-center justify-center text-lg w-full bg-black text-white py-3 rounded-lg mt-5">Continue</Link>
                </div>
            </div>
        </div>
    )
}

export default HomeAll;