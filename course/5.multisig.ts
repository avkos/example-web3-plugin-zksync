import {
    ZKsyncPlugin,
    types,
    Web3ZKsyncL2,
    ContractFactory,
    getPaymasterParams
} from 'web3-plugin-zksync'
import {Address, Web3} from 'web3'
import {DAI_L2, richAccount} from './helpers/constants'
import TwoUserMultisig from './helpers/TwoUserMultisig'
import {APPROVAL_TOKEN, PAYMASTER} from "../constant";
import {ETH_ADDRESS} from "../../web3-plugin-zksync/src/constants";

const test = async () => {
    const web3 = new Web3('http://localhost:8545')
    const l2Provider = Web3ZKsyncL2.initWithDefaultProvider(types.Network.Localhost)
    web3.registerPlugin(new ZKsyncPlugin(l2Provider))

    const smartAccount = new web3.ZKsync.SmartAccount({ address: richAccount.address, secret: richAccount.privateKey })
    console.log('--------Deploy multisig contract---------')
    const deployer = web3.ZKsync.ECDSASmartAccount.create(
        richAccount.address,
        richAccount.privateKey,
    );

    const multisigAccountAbi = TwoUserMultisig.abi;
    const multisigAccountBytecode: string = TwoUserMultisig.bytecode;
    const factory = new ContractFactory(
        multisigAccountAbi,
        multisigAccountBytecode,
        smartAccount,
        'createAccount',
    );
    const owner1 = new web3.ZKsync.Wallet(richAccount.privateKey);
    const owner2 = web3.ZKsync.Wallet.createRandom();
    const multisigContract = await factory.deploy([owner1.address, owner2.address]);
    const multisigAddress = multisigContract.options.address as Address;
    console.log('Multisig address:', multisigAddress);
    console.log('Refill Multisig account')
    await (
        await deployer.sendTransaction({
            to: multisigAddress,
            value: web3.utils.toWei('1', 'ether'),
        })
    ).wait();

    console.log('Refill owner2 account')
    await (
        await deployer.sendTransaction({
            to: owner2.address,
            value: web3.utils.toWei('1', 'ether'),
        })
    ).wait();



    const multiSigAccount = web3.ZKsync.MultisigECDSASmartAccount.create(
        multisigAddress,
        [owner1.account.privateKey, owner2.account.privateKey],
    );

    console.log('---------Multisig transfer example---------')
    const amount = web3.utils.toWei('0.1', 'ether');

    const recipient = web3.ZKsync.Wallet.createRandom();
    console.log('Recipient balance before:',await recipient.getBalance())
    const tx = await multiSigAccount.transfer({
        token: ETH_ADDRESS,
        to: recipient.address,
        amount: amount,
    });
    const receipt = await tx.wait();
    console.log('Recipient balance after:',await recipient.getBalance())
    console.log('Transaction:', receipt);


    console.log('---------Multisig transfer token using paymaster example---------')
    console.log('Send approval tokens to multisig account')
    const sendApprovalTokenTx = await deployer.transfer({
        to: multisigAddress,
        token: APPROVAL_TOKEN,
        amount: 5,
    });
    await sendApprovalTokenTx.wait();

    console.log('Send DAI tokens to multisig account')
    const sendTokenTx = await deployer.transfer({
        to: multisigAddress,
        token: DAI_L2,
        amount: 20,
    });
    await sendTokenTx.wait();

   console.log('Multisig balance before',await multiSigAccount.getBalance())
   console.log('Multisig approval token balance before',await multiSigAccount.getBalance(APPROVAL_TOKEN))
   console.log('Recipient balance before',await recipient.getBalance())

    const paymasterTx = await multiSigAccount.transfer({
        token: ETH_ADDRESS,
        to: recipient.getAddress(),
        amount,
        paymasterParams: getPaymasterParams(PAYMASTER, {
            type: 'ApprovalBased',
            token: APPROVAL_TOKEN,
            minimalAllowance: 1,
            innerInput: new Uint8Array(),
        }),
    });
    const paymasterTxReceipt = await paymasterTx.wait();
    console.log('Multisig balance after:',await multiSigAccount.getBalance())
    console.log('Multisig approval token balance after:',await multiSigAccount.getBalance(APPROVAL_TOKEN))
    console.log('Recipient balance after:',await recipient.getBalance())
    console.log('Transaction:', paymasterTxReceipt);
}


test().catch(console.error)
