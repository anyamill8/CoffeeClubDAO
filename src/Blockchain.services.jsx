import Web3 from 'web3'
import { setGlobalState, getGlobalState } from './store'
import abiDAO from './abis/DominionDAO.json'
import abiCoffee from './abis/CoffeeFriend.json'

const { ethereum } = window
window.web3 = new Web3(ethereum)
window.web3 = new Web3(window.web3.currentProvider)
const toWei = (num) => window.web3.utils.toWei(num.toString(), 'ether')
const fromWei = (num) => window.web3.utils.fromWei(num)

// connect a MetaMask wallet
const connectWallet = async () => {
    try {
        if (!ethereum) return alert('Please install Metamask')
        const accounts = await ethereum.request({method: 'eth_requestAccounts'})
        setGlobalState('connectedAccount', accounts[0].toLowerCase())
        window.location.reload()
    } catch (error) {
        reportError(error)
    }
}

// verify wallet is connected
const isWalletConnected = async () => {
    try {
        if (!ethereum) return alert('Please install Metamask')
        const accounts = await ethereum.request({ method: 'eth_accounts' })

        window.ethereum.on('chainChanged', (chainId) => {
            window.location.reload()
        })

        window.ethereum.on('accountsChanged', async () => {
            setGlobalState('connectedAccount', accounts[0].toLowerCase())
            await isWalletConnected()
            await getInfo()
        })

        if (accounts.length) {
            setGlobalState('connectedAccount', accounts[0].toLowerCase())
        } else {
            alert('Please connect wallet.')
            console.log('No accounts found.')
        }
    } catch (error) {
        reportError(error)
    }
}

// connect to contract governing DAO
const getDaoContract = async () => {
    const connectedAccount = getGlobalState('connectedAccount')

    if (connectedAccount) {
        const web3 = window.web3
        const networkId = await web3.eth.net.getId()
        const networkData = await abiDAO.networks[networkId]
        if (networkData) {
            const contract = new web3.eth.Contract(abiDAO.abi, networkData.address)
            return contract
        } else {
            return null
        }
    } else {
        return getGlobalState('contract')
    }
}

// connect to contract generating NFTs
const getCoffeeContract = async () => {
    const connectedAccount = getGlobalState('connectedAccount')

    if (connectedAccount) {
        const web3 = window.web3
        const networkId = await web3.eth.net.getId()
        const networkData = await abiCoffee.networks[networkId]
        if (networkData) {
            const contract = new web3.eth.Contract(abiCoffee.abi, networkData.address)
            return contract
        } else {
            return null
        }
    } else {
        return getGlobalState('contract')
    }
}

// purchase a coffee
const buyCoffee = async (amount) => {
    try {
        const contract = await getCoffeeContract()
        const account = getGlobalState('connectedAccount')
        await contract.methods.completeCoffeeBuyWithEth().send({ from: account, value: toWei(amount) })
        const points = await contract.methods.getCoffeePoints(account).call({ from: account})
        setGlobalState('coffeePoints', points)
        console.log('points', points)
    } catch (error) {
        reportError(error)
        return error
    }
}

// claim NFT once 10 coffee points is reached
const claimNFT = async () => {
    try {
        const contractCoffee = await getCoffeeContract()
        const account = getGlobalState('connectedAccount')
        await contractCoffee.methods.mintCoffeeNFT().send({ from: account })
        window.location.reload();
    } catch (error) {
        reportError(error)
        return error
    }
}

// contribute an NFT(s) to the DAO
const performContribute = async (amount) => {
    try {
        const contractDao = await getDaoContract()
        console.log('contract DAO', contractDao)
        const account = getGlobalState('connectedAccount')
        console.log('account', account)
        const contractCoffee = await getCoffeeContract()
        console.log('contract coffee', contractCoffee)
        const tokens = await contractCoffee.methods.getTokens(account).call({ from: account })
        console.log('tokens', tokens)
        await contractCoffee.methods.setApprovalForAll(contractDao.options.address, true).send({ from: account })
        console.log('approval passed')
        await contractDao.methods.contribute(amount, tokens, contractCoffee.options.address).send({ from: account })
        console.log('contribute passed')

        await getInfo();
    } catch (error) {
        reportError(error)
        return error
    }
}

// update global state variables
const getInfo = async () => {
    try {
        if (!ethereum) return alert('Please install Metamask')

        const connectedAccount = getGlobalState('connectedAccount')
        const contractDAO = await getDaoContract()
        const contractCoffee = await getCoffeeContract()
        const coffeePoints = await contractCoffee.methods.getCoffeePoints(connectedAccount).call({ from: connectedAccount})
        const isStakeholder = await contractDAO.methods.isStakeholder().call({ from: connectedAccount })
        const balance = await contractDAO.methods.daoBalance().call()
        const mybalance = await contractDAO.methods.getBalance().call({ from: connectedAccount })
        
        setGlobalState('balance', balance)
        setGlobalState('myBalance', mybalance)
        setGlobalState('isStakeholder', isStakeholder)
        setGlobalState('coffeePoints', coffeePoints)
    } catch (error) {
        reportError(error)
    }
}

// create a proposal for DAO
const raiseProposal = async ({ title, description, beneficiary }) => {
    try {
      const contract = await getDaoContract()
      const account = getGlobalState('connectedAccount')
  
      await contract.methods
        .createProposal(title, description, beneficiary)
        .send({ from: account })
  
      window.location.reload()
    } catch (error) {
      reportError(error)
      return error
    }
  }

// view a proposal in DAO
const getProposals = async () => {
    try {
      if (!ethereum) return alert('Please install Metamask')
    
      const account = getGlobalState('connectedAccount')
      console.log(account, 'account')
      const contract = await getDaoContract()
      console.log(contract, 'contract')
      const proposals = await contract.methods.getProposals().call({ from: account })
      console.log(proposals, 'contract')
      setGlobalState('proposals', structuredProposals(proposals))
    } catch (error) {
      reportError(error)
    }
  }

// general proposal structure
const structuredProposals = (proposals) => {
return proposals
    .map((proposal) => ({
    id: proposal.id,
    title: proposal.title,
    description: proposal.description,
    paid: proposal.paid,
    passed: proposal.passed,
    proposer: proposal.proposer,
    upvotes: Number(proposal.upvotes),
    downvotes: Number(proposal.downvotes),
    beneficiary: proposal.beneficiary,
    executor: proposal.executor,
    duration: proposal.duration,
    }))
    .reverse()
}

// find a specific proposal for display
const getProposal = async (id) => {
    try {
      const proposals = getGlobalState('proposals')
      return proposals.find((proposal) => proposal.id == id)
    } catch (error) {
      reportError(error)
    }
  }
  
// allow DAO member to vote on proposal
const voteOnProposal = async (proposalId, supported) => {
try {
    const contract = await getDaoContract()
    const account = getGlobalState('connectedAccount')
    await contract.methods
    .performVote(proposalId, supported)
    .send({ from: account })

    window.location.reload()
} catch (error) {
    reportError(error)
}
}

// show all voters for a particular proposal
const listVoters = async (id) => {
try {
    const contract = await getDaoContract()
    const votes = await contract.methods.getVotesOf(id).call()
    return votes
} catch (error) {
    reportError(error)
}
}

// catch error method
const reportError = (error) => {
    console.log(error.message);
    throw new Error('No ethereum object.')
}

export { connectWallet, isWalletConnected, buyCoffee, performContribute, getInfo, 
    claimNFT, getProposals, raiseProposal, getProposal, voteOnProposal, listVoters}