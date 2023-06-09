var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocialLoginSDK = exports.socialLoginSDK = void 0;
const react_1 = __importDefault(require("react"));
const client_1 = require("react-dom/client");
const ethers_1 = require("ethers");
const core_1 = require("@web3auth/core");
const base_1 = require("@web3auth/base");
const openlogin_adapter_1 = require("@web3auth/openlogin-adapter");
const metamask_adapter_1 = require("@web3auth/metamask-adapter");
const wallet_connect_v1_adapter_1 = require("@web3auth/wallet-connect-v1-adapter");
const qrcode_modal_1 = __importDefault(require("@walletconnect/qrcode-modal"));
const node_client_1 = __importDefault(require("@biconomy/node-client"));
const UI_1 = __importDefault(require("@biconomy/web3-auth/dist/src/UI"));
function createLoginModal(socialLogin) {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const root = (0, client_1.createRoot)(document.getElementById('w3a-modal'));
    root.render(react_1.default.createElement(UI_1.default, { socialLogin: socialLogin }));
}
class SocialLogin {

    constructor(backendUrl = defaultSocialLoginConfig.backendUrl) {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        this.iWin = false;
        this.iframeInitialized = false;
        this.isInit = false;
        this.userInfo = null;
        this.web3auth = null;
        this.provider = null;
        this.createWalletDiv();
        this.isInit = false;
        this.web3auth = null;
        this.provider = null;
        this.clientId =
            'BDtxlmCXNAWQFGiiaiVY3Qb1aN-d7DQ82OhT6B-RBr5j_rGnrKAqbIkvLJlf-ofYlJRiNSHbnkeHlsh8j3ueuYY';
        this.backendUrl = backendUrl;
        this.nodeClient = new node_client_1.default({ txServiceUrl: this.backendUrl });
        this.whiteLabel = {
            name: 'Biconomy SDK',
            logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/9543.png'
        };
    }
    async whitelistUrl(origin) {
        const whiteListUrlResponse = await this.nodeClient.whitelistUrl(origin);
        return whiteListUrlResponse.data;
    }
    async init(socialLoginDTO) {
        const finalDTO = {
            chainId: '0x1',
            displayName: 'Ethereum',
            whitelistUrls: {},
            network: 'mainnet',
            blockExplorer: 'https://etherscan.io',
            whteLableData: this.whiteLabel,
            rpcTarget: 'https://rpc.ankr.com/eth'
        };
        if (socialLoginDTO) {
            if (socialLoginDTO.chainId)
                finalDTO.chainId = socialLoginDTO.chainId;
            if (socialLoginDTO.network)
                finalDTO.network = socialLoginDTO.network;
            if (socialLoginDTO.whitelistUrls)
                finalDTO.whitelistUrls = socialLoginDTO.whitelistUrls;
            if (socialLoginDTO.whteLableData)
                this.whiteLabel = socialLoginDTO.whteLableData;
            if (socialLoginDTO.rpcTarget)
                finalDTO.rpcTarget = socialLoginDTO.rpcTarget;
            if (socialLoginDTO.displayName)
                finalDTO.displayName = socialLoginDTO.displayName;
            if (socialLoginDTO.blockExplorer)
                finalDTO.blockExplorer = socialLoginDTO.blockExplorer
        }
        try {
            const web3AuthCore = new core_1.Web3AuthCore({
                clientId: this.clientId,
                chainConfig: {
                    chainNamespace: base_1.CHAIN_NAMESPACES.EIP155,
                    displayName: finalDTO.displayName,
                    chainId: finalDTO.chainId,
                    rpcTarget: finalDTO.rpcTarget,
                    blockExplorer: finalDTO.blockExplorer,
                }
            });
            const openloginAdapter = new openlogin_adapter_1.OpenloginAdapter({
                adapterSettings: {
                    clientId: this.clientId,
                    network: finalDTO.network,
                    uxMode: 'popup',
                    whiteLabel: {
                        name: this.whiteLabel.name,
                        logoLight: this.whiteLabel.logo,
                        logoDark: this.whiteLabel.logo,
                        defaultLanguage: 'en',
                        dark: true
                    },
                    originData: finalDTO.whitelistUrls
                }
            });
            const metamaskAdapter = new metamask_adapter_1.MetamaskAdapter({
                clientId: this.clientId
            });
            const wcAdapter = new wallet_connect_v1_adapter_1.WalletConnectV1Adapter({
                adapterSettings: {
                    qrcodeModal: qrcode_modal_1.default
                }
            });
            console.log('web3AuthCore', web3AuthCore)
            console.log('openloginAdapter: ', openloginAdapter);
            console.log('metamaskAdapter: ', metamaskAdapter);
            console.log('wcAdapter: ', wcAdapter);

            web3AuthCore.configureAdapter(openloginAdapter);
            web3AuthCore.configureAdapter(metamaskAdapter);
            web3AuthCore.configureAdapter(wcAdapter);
            await web3AuthCore.init();
            this.web3auth = web3AuthCore;
            if (web3AuthCore && web3AuthCore.provider) {
                this.provider = web3AuthCore.provider;
            }
            createLoginModal(this);
            this.isInit = true;
        }
        catch (error) {
            console.error(error);
        }
    }
    getProvider() {
        return this.provider;
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    _createIframe(iframeContainerDiv) {
        this.walletIframe = document.createElement('iframe');
        this.walletIframe.style.display = 'none';
        this.walletIframe.style.display = 'relative';
        this.walletIframe.onload = () => {
            this.iWin = this.walletIframe.contentWindow || this.walletIframe;
            this.iframeInitialized = true;
        };
        iframeContainerDiv.appendChild(this.walletIframe);
    }
    createWalletDiv() {
        // create a fixed div into html but keep it hidden initially
        const walletDiv = document.createElement('div');
        walletDiv.id = 'w3a-modal';
        walletDiv.className = 'w3a-modal w3a-modal--light';
        walletDiv.style.display = 'none';
        walletDiv.style.position = 'fixed';
        walletDiv.style.top = '0';
        walletDiv.style.right = '0';
        walletDiv.style.height = '100%';
        walletDiv.style.width = '100%';
        walletDiv.style.background = 'rgba(33, 33, 33, 0.75)';
        walletDiv.style.zIndex = '100';
        this.walletDiv = walletDiv;
        // insert div into top of body.
        document.body.insertBefore(walletDiv, document.body.firstChild);
        this._createIframe(walletDiv);
    }
    showWallet() {
        this.walletDiv.style.display = 'block';
        this.walletIframe.style.display = 'block';
        // Set height and width of the iframe to 600x341
        this.walletIframe.style.height = '600px';
        this.walletIframe.style.width = '341px';
        this.walletIframe.style.border = '0px';
        this.walletIframe.style.borderRadius = '3%';
        const el = document.getElementById('w3a-modal');
        el === null || el === void 0 ? void 0 : el.dispatchEvent(new Event('show-modal'));
    }
    hideWallet() {
        console.log('hide wallet');
        this.walletDiv.style.display = 'none';
        this.walletIframe.style.display = 'none';
    }
    async getUserInfo() {
        if (this.web3auth) {
            const userInfo = await this.web3auth.getUserInfo();
            this.userInfo = userInfo;
            return userInfo;
        }
        return null;
    }
    async getPrivateKey() {
        if (this.web3auth && this.web3auth.provider) {
            const privateKey = await this.web3auth.provider.request({
                method: 'eth_private_key'
            });
            return privateKey;
        }
        return null;
    }
    async socialLogin(loginProvider) {
        if (!this.web3auth) {
            console.log('web3auth not initialized yet');
            return;
        }
        try {
            const web3authProvider = await this.web3auth.connectTo(base_1.WALLET_ADAPTERS.OPENLOGIN, {
                loginProvider: loginProvider
            });
            if (!web3authProvider) {
                console.error('web3authProvider is null');
                return null;
            }
            const web3Provider = new ethers_1.ethers.providers.Web3Provider(web3authProvider);
            const signer = web3Provider.getSigner();
            const gotAccount = await signer.getAddress();
            const network = await web3Provider.getNetwork();
            console.info(`EOA Address ${gotAccount}\nNetwork: ${network}`);
            this.provider = web3authProvider;
            return web3authProvider;
        }
        catch (error) {
            console.error(error);
            return error;
        }
    }
    async emailLogin(email) {
        if (!this.web3auth) {
            console.info('web3auth not initialized yet');
            return;
        }
        try {
            const web3authProvider = await this.web3auth.connectTo(base_1.WALLET_ADAPTERS.OPENLOGIN, {
                loginProvider: 'email_passwordless',
                login_hint: email
            });
            if (!web3authProvider) {
                console.error('web3authProvider is null');
                return null;
            }
            const web3Provider = new ethers_1.ethers.providers.Web3Provider(web3authProvider);
            const signer = web3Provider.getSigner();
            const gotAccount = await signer.getAddress();
            const network = await web3Provider.getNetwork();
            console.info(`EOA Address ${gotAccount}\nNetwork: ${network.toString()}`);
            this.provider = web3authProvider;
            return web3authProvider;
        }
        catch (error) {
            console.error(error);
            return error;
        }
    }
    async metamaskLogin() {
        if (!this.web3auth) {
            console.log('web3auth not initialized yet');
            return;
        }
        try {
            const web3authProvider = await this.web3auth.connectTo(base_1.WALLET_ADAPTERS.METAMASK);
            if (!web3authProvider) {
                console.log('web3authProvider is null');
                return null;
            }
            const web3Provider = new ethers_1.ethers.providers.Web3Provider(web3authProvider);
            const signer = web3Provider.getSigner();
            const gotAccount = await signer.getAddress();
            const network = await web3Provider.getNetwork();
            console.info(`EOA Address ${gotAccount}\nNetwork: ${network}`);
            this.provider = web3authProvider;
            return web3authProvider;
        }
        catch (error) {
            console.error(error);
            return error;
        }
    }
    async walletConnectLogin() {
        if (!this.web3auth) {
            console.log('web3auth not initialized yet');
            return;
        }
        try {
            const web3authProvider = await this.web3auth.connectTo(base_1.WALLET_ADAPTERS.WALLET_CONNECT_V1);
            if (!web3authProvider) {
                console.log('web3authProvider is null');
                return null;
            }
            const web3Provider = new ethers_1.ethers.providers.Web3Provider(web3authProvider);
            const signer = web3Provider.getSigner();
            const gotAccount = await signer.getAddress();
            const network = await web3Provider.getNetwork();
            console.info(`EOA Address ${gotAccount}\nNetwork: ${network}`);
            this.provider = web3authProvider;
            return web3authProvider;
        }
        catch (error) {
            console.error(error);
            return error;
        }
    }
    async logout() {
        if (!this.web3auth) {
            console.log('web3auth not initialized yet');
            return;
        }
        await this.web3auth.logout();
        this.web3auth.clearCache();
        this.provider = null;
    }
}
const defaultSocialLoginConfig = {
    backendUrl: 'https://sdk-backend.prod.biconomy.io/v1'
};
exports.default = SocialLogin;
let initializedSocialLogin = null;
const getSocialLoginSDK = async (socialLoginDTO) => {
    if (initializedSocialLogin) {
        return initializedSocialLogin;
    }
    await socialLoginSDK.init(socialLoginDTO);
    initializedSocialLogin = socialLoginSDK;
    return socialLoginSDK;
};
exports.getSocialLoginSDK = getSocialLoginSDK;
/* eslint-disable  @typescript-eslint/no-explicit-any */
const socialLoginSDK = new SocialLogin();
exports.socialLoginSDK = socialLoginSDK;
window.socialLoginSDK = socialLoginSDK;
//# sourceMappingURL=SocialLogin.js.map