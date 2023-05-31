import React, { useState, useEffect, useRef, useCallback} from "react";
import { useNavigate } from 'react-router-dom';
import { ethers } from "ethers";
import {errorPopup, loadingPopup, successPopup, warningPopup} from './utils/PopUpMessage'
import { ABI } from "./utils/ABIs";
import { CONTRACT } from "./utils/contracts";
import { useWeb3AuthContext } from "./utils/contexts/SocialLoginContext.tsx";
import Web3 from 'web3'
import './css/login.css'


export default function Main() {

    const {
        address,
        loading: eoaLoading,
        userInfo,
        connect,
        web3Provider,
    } = useWeb3AuthContext();

    const navigator = useNavigate();
    const username = localStorage.getItem('username')
    const [loader, setLoader] = useState(false);
    const [sign, isSign] = useState(false);
    const [user, setUser] = useState({
        username: '',
        password: ''
    })


    useEffect(() => {
        //setAccount("Login")
        //setFooterAccount("forgotFooter")
        //if(username){
        //    navigator(`/debug/`)
        //    warningPopup("Please try logging out and in again")
        //}else{
        //    navigator("/loginBETA")
        //}
    }, []);


    useEffect(() => {
        if (user.username) {
            isSign(true)
        }
      }, []);


    const handleWeb3SignIn = async e => {
        connect()
        setTimeout(function(){
            isSign(true)
        }, 4000);
        
        const web3 = new Web3(web3Provider.provider);

        const accounts = await web3Provider.listAccounts();
        const userAddress = accounts[0]
        const message = "Hello there! Sign this message to authenticate in Buckets"
        const signature = await create_signature(web3, message, accounts)

        setLoader(true)
        const data = {
            userAddress: userAddress,
            signature: signature,
            message: message
        }

        setUser({
            username: userAddress,
            password: signature
        });

        //const response = await fetch(URLS.Auth, { "method": 'POST', headers: { "Access-Control-Allow-Origin": '*', "Content-Type": "application/json" }, body: JSON.stringify(data) })
        //const responseJSON = await response.json()
        
    }

    async function create_signature(web3, message, accounts) {
        var hex = ''
        for(var i=0;i<message.length;i++) {
            hex += ''+message.charCodeAt(i).toString(16)
        }
        var hexMessage = "0x" + hex
        var signature = web3.eth.personal.sign(hexMessage, accounts[0])
        return signature
    }
    

    function loginDiv() {
        return (
            <div className="mb-4 mt-4">
                <p className="fs-title-2 text-center" align="justify">
                    Welcome to Buckets, your next-gen wealth management app!
                </p>
                <p className="text-center" align="justify">
                    Connect with your socials or wallet below.
                </p>
                <button type="button" id="btn-login" className="btn btn-orange shadow-sm" onClick={handleWeb3SignIn} >
                    Login
                </button>
            </div> 
        )
    };
    
    function signDiv() {
        return (
            <div className="mb-4 mt-4">
                <p className="fs-title-2 text-center" align="justify">
                    Welcome to Buckets, your next-gen wealth management app!
                </p>
                <p className="text-center" align="justify">
                    Sign the message with your wallet to verify ownership.
                </p>
                <button type="button" id="btn-login" className="btn btn-orange shadow-sm" onClick={handleWeb3SignIn} >
                    Sign
                </button>
            </div> 
        )
    };

    return (
        <>
        <div className="bucket-background"> 
        <div className="container">

<div className="row justify-content-center">

    <div className="col-xl-10 col-lg-12 col-md-9">

        <div className="card o-hidden border-0 shadow-lg my-5">
            <div className="card-body p-0">
                {/* <!-- Nested Row within Card Body --> */}
                <div className="row">
                    <div className="col-lg-6 d-none d-lg-block bg-password-image"></div>
                    <div className="col-lg-6">
                        <div className="p-5">
                            <div className="text-center">
                                {sign? signDiv() : loginDiv()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

</div>

</div>
        </div>
        </>
    )
}