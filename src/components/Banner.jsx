import { Link } from 'react-router-dom'
import { performContribute } from '../Blockchain.services'
import { toast } from 'react-toastify'
import { setGlobalState, useGlobalState } from '../store'
import { useState } from 'react'

const Banner = () => {
  const [amount, setAmount] = useState('')
  const [isStakeholder] = useGlobalState('isStakeholder')
  const[ proposals] = useGlobalState('proposals')
  const [balance] = useGlobalState('balance')
  const [myBalance] = useGlobalState('myBalance')
  
  const onContribute = async () => {

    if(!!!amount || amount == '') return
    await performContribute(amount)
    toast.success('Contribution received')
    setAmount('')
  }

  const getOpened = () => proposals.filter(
    (proposal) => new Date().getTime() < Number(proposal.duration) + '000').length

  return (
    <div className="p-8">
      <h2 className="font-semibold justify-between flex text-3xl mb-5">{getOpened()} 
      {getOpened() == 1 ? ' Proposal' : ' Proposals'} Currently Opened
      <span className="justify-end items-center space-x-2">
      <Link to={`/docs/` + 1} className="inline-block px-6 py-2.5 bg-orange-500
        text-[#efe4d5] font-medium text-sm leading-tight uppercase
        shadow-md shadow-gray-400 rounded-full hover:text-black hover:bg-orange-700
        transition duration-150 ease-in-out"
        >Read the Docs
        </Link>
        </span>
        </h2>
      <p>
        Current DAO Balance: {' '}
        <strong>{balance} {balance == 1 ? 'Coffee Friend' : 'Coffee Friends'}</strong> <br />
        Your Contributions: {' '}
        <span>
          <strong>{myBalance} {myBalance == 1 ? 'Coffee Friend' : 'Coffee Friends'}</strong>
          {isStakeholder ? ', and you are now a stakeholder' : null}
        </span>
      </p>
      <hr className="my-6 border-orange-700"/>
      <p>
        {false ?
            'You can now raise proposals on this platform' :
            'When you contribute 1 Coffee Friend NFT you become a stakeholder!'
        }
      </p>
      <div className="flex justify-start items-center md:w-1/3 w-full mt-4"
      >
        <input type="number"
        className="form-control block w-full px-3 py-1.5 text-base 
        font-normal text-orange-700 bg-clip-padding border-solid 
        border-orange-700 rounded transition ease-in-out m-0 shadow-md
        focus:text-orange-500 focus:outline-none " onChange={(e) => setAmount(e.target.value)} 
        value={amount} placeholder="E.g. 2 Coffee Friends"
        required/>
      </div>
      <div className="flex justify-start items-center mt-4 space-x-2">
        <button className="inline-block px-6 py-2.5 bg-orange-500
        text-[#efe4d5] font-medium text-sm leading-tight uppercase
        shadow-md shadow-gray-400 rounded-full hover:text-black hover:bg-orange-700
        transition duration-150 ease-in-out" onClick={onContribute}
        >Contribute</button>
         {isStakeholder ? (<button className="inline-block px-6 py-2.5 bg-orange-500
        text-[#efe4d5] font-medium text-sm leading-tight uppercase
        shadow-md shadow-gray-400 rounded-full hover:text-black hover:bg-orange-700
        transition duration-150 ease-in-out" onClick={() => setGlobalState('modal', 'scale-100')}
        >Propose
        </button>) : null}
      </div>
    </div>
  )
}

export default Banner