import React, { useState, useEffect, useRef, Fragment } from "react";
import SocialLogin from "@biconomy/web3-auth";
import "@biconomy/web3-auth/dist/src/style.css"
import { ChainId } from "@biconomy/core-types";
import { ethers } from "ethers";

export default function Login() {
    const sdkRef = useRef();  


    useEffect(() => {
        initSocialLogin()

    }, []);


    const initSocialLogin = async e => {
        try {
            // create an instance of SocialLogin 
            const socialLogin = new SocialLogin()

            const signature1 = await socialLogin.whitelistUrl('https://web3auth-aave.herokuapp.com/')
            await socialLogin.init({
                chainId: ethers.utils.hexValue(42161), //42161 is ARBITRUM. If Mumbai for example: ethers.utils.hexValue(ChainId.POLYGON_MUMBAI),
                whitelistUrls: {
                    'https://web3auth-aave.herokuapp.com/': signature1,
                }
            })

            sdkRef.current = socialLogin

        } catch (error) {
            console.log(error, "-----------Error with the the initSocialLogin function------------");
          }
    };

    const showWallet = async e => {
        sdkRef.current?.showWallet()
    }
    

    function web3Login() {
        return(
            <div className="wallet mb-4 mt-4">
                    <p className="text-center"><i> 
                        Login with your wallet provider or create a new wallet using your Gmail.
                    </i></p>
                <button type="button" id="btn-login" className="btn btn-orange shadow-sm" onClick={showWallet}>
                    Connect web3auth
                </button>

            </div>          
        )
    }


    return (
        <>
        <div className="bucket-background"> 
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col ">
                        {web3Login()}                            
                    </div>
                </div>
            </div>
        </div>
        </>
        )
}