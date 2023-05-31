import React, { useCallback, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3 from 'web3';
//import SocialLogin from "@biconomy/web3-auth";
import SocialLogin from "../SocialLogin";
import SmartAccount from "@biconomy/smart-account"



interface web3AuthContextType {
  connect: () => Promise<SocialLogin | null | undefined>;
  provider: any;
  ethersProvider: ethers.providers.Web3Provider | null;
  web3Provider: ethers.providers.Web3Provider | null;
  loading: boolean;
  chainId: number;
  address: string;
  userInfo: any;
}

const chainIds = {
  ARBITRUM_hex: '0xA4B1',
  ARBITRUM: 42161,
}


const rpcTarget = 'https://rpc.ankr.com/arbitrum'
const network = 'mainnet'
const displayName = 'Artbitrum'
const blockExplorer = 'https://arbitscan.io'



export const Web3AuthContext = React.createContext<web3AuthContextType>({


  connect: () => Promise.resolve(null),
  loading: false,
  provider: null,
  ethersProvider: null,
  web3Provider: null,
  chainId: chainIds.ARBITRUM,
  address: "",
  userInfo: null,
});
export const useWeb3AuthContext = () => useContext(Web3AuthContext);

export enum SignTypeMethod {
  PERSONAL_SIGN = "PERSONAL_SIGN",
  EIP712_SIGN = "EIP712_SIGN",
}

type StateType = {
  provider?: any;
  web3Provider?: ethers.providers.Web3Provider | null;
  ethersProvider?: ethers.providers.Web3Provider | null;
  address?: string;
  chainId?: number;
};
const initialState: StateType = {
  provider: null,
  web3Provider: null,
  ethersProvider: null,
  address: "",
  chainId: chainIds.ARBITRUM,
};

export const Web3AuthProvider = ({ children }: any) => {
  const [web3State, setWeb3State] = useState<StateType>(initialState);
  const { provider, web3Provider, ethersProvider, address, chainId } =
    web3State;
  const [loading, setLoading] = useState(false);
  const [socialLoginSDK, setSocialLoginSDK] = useState<SocialLogin | null>(
    null
  );
  const [userInfo, setUserInfo] = useState<any>(null);
  const [smartAccount, setSmartAccount] = useState(null)
  const [interval, enableInterval] = useState(false)



  const WEBSITE_URL = 'https://www.buckets.digital/'

  const initSmartAccount = useCallback(async () => {
      if (!socialLoginSDK?.provider) return;

    socialLoginSDK.hideWallet();
    const web3Provider = new ethers.providers.Web3Provider(socialLoginSDK.provider);
    console.log('web3Provider: ', web3Provider)

    try {
        const account = new SmartAccount(web3Provider, {
            activeNetworkId: chainIds.ARBITRUM,
            supportedNetworkIds: [chainIds.ARBITRUM]
        });
        await account.init();
        setSmartAccount(account);
        console.log('SmartAccoutn: ', account)
        // loadWeb3();
    } catch (err) {
        console.log('error setting up smart account..', err);
    }
  }, [chainIds.ARBITRUM])

  useEffect(() => {
    let loginConfig;

    if (interval) {
        loginConfig = setInterval(() => {
            if (!!socialLoginSDK?.provider) {
                try {
                    initSmartAccount();
                    clearInterval(loginConfig)
                } catch (error) {
                    console.log(error, "-----------Error initializing smart account------------");
                }
            }
        }, 1000)
    }
  }, [interval, initSmartAccount])



  async function connect() {
      if (!socialLoginSDK) {

      try {
          const socialLoginSDK = new SocialLogin()
          const signature1 = await socialLoginSDK.whitelistUrl(WEBSITE_URL)

          await socialLoginSDK.init({
              chainId: chainIds.ARBITRUM_hex,
              whitelistUrls: {
                  [WEBSITE_URL]: signature1,
              },
              network,
              rpcTarget,
              blockExplorer,
              displayName,
          })
          //sdkRef.current = socialLoginSDK
      } catch (error) {
          console.log(error, "-----------Error with the connect function------------");
      }
      }

      if (!socialLoginSDK.provider) {

          socialLoginSDK.showWallet()
          enableInterval(true)
      } else {
          try {
              initSmartAccount()
          } catch (error) {
              console.log(error, "-----------Error initiating smart account------------");
          }
      }
  }

  
  return (
    <Web3AuthContext.Provider
      value={{
        connect,
        loading,
        provider: provider,
        ethersProvider: ethersProvider || null,
        web3Provider: web3Provider || null,
        chainId: chainId || 0,
        address: address || "",
        userInfo,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
};