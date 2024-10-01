# Articles

- [Setting Up Your ZKsync Development Environment with Web3.js Plugin](https://blog.chainsafe.io/setting-up-your-zksync-development-environment-with-web3-js-plugin/)

- [Working with the ZKsync L2 Provider Using web3-plugin-zksync](https://blog.chainsafe.io/working-with-the-zksync-l2-provider-using-web3-plugin-zksync/)

- [Working with Wallets on ZKsync using Web3.js](https://blog.chainsafe.io/working-with-wallets-on-zksync-using-web3-js/)

- [Smart Accounts on ZKsync Layer 2 with Web3.js](https://blog.chainsafe.io/smart-accounts-on-zksync-layer-2-with-web3-js/)

- [Paymaster on ZKsync Layer 2 with Web3.js](https://blog.chainsafe.io/paymaster-on-zksync-layer-2-with-web3-js/)

- [Exploring Multisig in ZKsync using Web3.js](https://blog.chainsafe.io/exploring-multisig-in-zksync-using-web3-js/)

- [Using Injected Providers in a React App with ZKsync and Web3js](https://blog.chainsafe.io/using-injected-providers-in-a-react-app-with-zksync-and-web3js/)


# Step to test

## Install
```yarn install```

## Expose env
```
export PK=... # private key of the account
```

## RUN
### Wallet and Smart Accounts
```
npx ts-node wallet-and-smart-account.ts      
```

### Transfer ETH using paymaster
```
npx ts-node paymaster-transfer-eth.ts    
```

### Transfer ERC20 token using paymaster
```
npx ts-node paymaster-transfer-erc20-token.ts
```

