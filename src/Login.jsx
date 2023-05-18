import React, { useState, useEffect, useRef, Fragment } from "react";
import { ABI } from "./utils/ABIs";
import { CONTRACT } from "./utils/contracts";
import SocialLogin from "@biconomy/web3-auth";
import "@biconomy/web3-auth/dist/src/style.css"
import { ChainId } from "@biconomy/core-types";
import { ethers } from "ethers";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function Login() {
    const sdkRef = useRef();
    const [account, setAccount] = useState("")
    const [interval, enableInterval] = useState(false)
    const coinsData = [
        { Asset: 'DAI', APY: '1%' },
        { Asset: 'USDC', APY: '1%' },
        { Asset: 'ETH', APY: '1%' }
      ];


    useEffect(() => {
        //Initiate Biconomy login at page refresh
        initSocialLogin()
    }, []);

    useEffect(() => {
        //Hide the wallet modal if user is already connected (PS: this solution is not ideal in terms of UX)
        if(account) {
            sdkRef.current.hideWallet()
            return;
        }
    }, [account]);


    const initSocialLogin = async e => {
        try {
            // create an instance of SocialLogin 
            const socialLogin = new SocialLogin()

            //Whitelist domain. Only necessary in production, not in local
            const signature1 = await socialLogin.whitelistUrl('https://web3auth-aave.herokuapp.com/')
            await socialLogin.init({
                chainId: ethers.utils.hexValue(42161), //42161 is ARBITRUM. If Mumbai for example: ethers.utils.hexValue(ChainId.POLYGON_MUMBAI),
                whitelistUrls: {
                    'https://web3auth-aave.herokuapp.com/': signature1,
                }
            })

            //Saving the socialLogin instance under sdkRef for future uses
            sdkRef.current = socialLogin

        } catch (error) {
            console.log(error, "-----------Error with the the initSocialLogin function------------");
          }
    };


    //Show the wallet modal when clicking on button
    const showWallet = async e => {
        sdkRef.current?.showWallet()

        if (!sdkRef.current?.provider) return;
        const provider = new ethers.providers.Web3Provider(
            sdkRef.current?.provider,
        );
        const accounts = await provider.listAccounts();
        setAccount(accounts)
    }

    function web3Login() {
        return(
            <div className="mb-4 mt-4">
                    <p className="text-center"><i> 
                        Login with your wallet provider or create a new wallet using your Gmail.
                    </i></p>
                <button type="button" id="btn-login" className="btn btn-orange shadow-sm" onClick={showWallet}>
                    Connect web3auth
                </button>

            </div>   

        )
    }

    //Logging out the user when clicking on button
    const logout = async e => {
        sdkRef.current?.logout()
        console.log("Logged out")
        setAccount('')
    }    

    function web3logout() {
        return (
            <>
            <div>
                {account}
            </div>
            <div>
            <button type="button" id="btn-login" className="btn btn-grey shadow-sm" onClick={logout}>
                    Logout
            </button>
            </div>
            </>
        )

    }

    // Config of buttons to deposit/withdraw into Aave protocol (to be finalized with web3.js and relevant contracts)
    const DepositTemplate = (rowData) => {
        let assetRow = rowData.Asset

        switch (assetRow)

        {
           case "DAI":
                return (
                    <button type="button" className="btn rounded-pill btn-white shadow-sm" data-toggle="modal" data-target="#depositTableModal" style={{fontSize: "15px" }} >
                        Deposit DAI
                    </button>
                )
            
            case "USDC":
                return (
                    <button type="button" className="btn rounded-pill btn-white shadow-sm" data-toggle="modal" data-target="#depositTableModal" style={{fontSize: "15px" }} >
                        Deposit USDC
                    </button>
                )

            case "ETH":
                return (
                    <button type="button" className="btn rounded-pill btn-white shadow-sm" data-toggle="modal" data-target="#depositTableModal" style={{fontSize: "15px" }} >
                        Deposit ETH
                    </button>
                )
                
           default: 
               console.log(assetRow);
        }
    }

    const WithdrawTemplate = (rowData) => {
        let assetRow = rowData.Asset

        switch (assetRow)

        {
           case "DAI":
                return (
                    <button type="button" className="btn rounded-pill btn-white shadow-sm" data-toggle="modal" data-target="#depositTableModal" style={{fontSize: "15px" }} >
                        Withdraw DAI
                    </button>
                )
            
            case "USDC":
                return (
                    <button type="button" className="btn rounded-pill btn-white shadow-sm" data-toggle="modal" data-target="#depositTableModal" style={{fontSize: "15px" }} >
                        Withdraw USDC
                    </button>
                )

            case "ETH":
                return (
                    <button type="button" className="btn rounded-pill btn-white shadow-sm" data-toggle="modal" data-target="#depositTableModal" style={{fontSize: "15px" }} >
                        Withdraw ETH
                    </button>
                )
                
           default: 
               console.log(assetRow);
        }
    }



    return (
        <>
        <div className="background">
            {/*Login*/}
            <section className="section">
                <div className="center">
                    {web3Login()}                            
                </div>
                <div className="mb-4 mt-4">
                    <p className="text-center">
                        {account? web3logout() : "Wallet not connected"}
                    </p>
                </div>
            </section>

            <hr />

            {/*Aave*/}
            <section className="section">
                <div className="center">
                    <div className="white">
                    <DataTable value={coinsData} showGridlines responsiveLayout="scroll">
                        <Column field="Asset" header="Asset" bodyClassName="text-center" style={{ width: '200px' }} alignHeader={'center'} ></Column>
                        <Column field="Deposit" header="Deposit" body={DepositTemplate} bodyClassName="text-center" style={{ width: '200px' }} alignHeader={'center'} ></Column>
                        <Column field="Withdraw" header="Withdraw" body={WithdrawTemplate} bodyClassName="text-center" style={{ width: '200px' }} alignHeader={'center'} ></Column>
                    </DataTable>
                    </div>
                </div>
            </section>


        </div>
        </>
        )
}