'use client'
import {TransactionReceipt, Web3} from 'web3'
import {ZKsyncPlugin} from 'web3-plugin-zksync'
import {useEffect, useState} from "react";

export default function Home() {
    const [web3, setWeb3] = useState<Web3 | undefined>()
    const [mainAccount, setMainAccount] = useState<string>('')
    const [mainAccountBalance, setMainAccountBalance] = useState<bigint | undefined>()
    const [sendSomewhereReceipt, setSendSomewhereReceipt] = useState<TransactionReceipt | undefined>()

    useEffect(() => {
        const web3 = new Web3('http://localhost:8545')
        web3.registerPlugin(new ZKsyncPlugin((window as any).ethereum))
        setWeb3(web3)
    }, [])


    const handleConnectToTheWallet = async () => {
        if (!web3) {
            return
        }
        try {
            const res = await web3.ZKsync.L2.eth.requestAccounts()
            if (res.length) {
                setMainAccount(res[0])
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleGetBalance = async () => {
        if (!web3) {
            return
        }
        setMainAccountBalance(await web3.ZKsync.L2.getBalance(mainAccount))
    }

    const handleSendSomewhere = async () => {
        if (!web3) {
            return
        }
        const randAcc = web3.eth.accounts.create()
        const tx = {
            from: mainAccount,
            to: randAcc.address,
            value: web3.utils.toWei('0.00001', 'ether'),
        }
        const populated = await web3.ZKsync.L2.populateTransaction(tx)
        console.log('populated', populated)
        const transaction = await web3.ZKsync.L2.eth.sendTransaction(populated)
        // console.log('transactionHash', transactionHash)
        // const receipt = await utils.waitTxReceipt(web3.ZKsync.L2.eth, transactionHash as string)
        setSendSomewhereReceipt(transaction)
    }

    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <button type='button' onClick={handleConnectToTheWallet}>Connect to the wallet</button>
                {mainAccount && (
                    <div>
                        <h1>Connected account: {mainAccount}</h1>
                        <div>
                            <div>
                                <button type='button' onClick={handleGetBalance}>Get balance</button>
                                : {mainAccountBalance ? web3!.utils.fromWei(mainAccountBalance, 'ether') : '-'} ETH
                            </div>

                        </div>
                        <div>
                            <button type='button' onClick={handleSendSomewhere}>Send 0.00001 ETH somewhere</button>
                            <div style={{whiteSpace: 'pre-wrap'}}>
                                {sendSomewhereReceipt && sendSomewhereReceipt.transactionHash ? <a target='_blank'
                                                                                                   href={`https://sepolia.explorer.zksync.io/tx/${sendSomewhereReceipt.transactionHash}`}>Check
                                    transaction in the explorer</a> : ''}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
