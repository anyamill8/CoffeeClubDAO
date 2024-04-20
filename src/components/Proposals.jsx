import Identicon from 'react-identicons'
import { Link } from 'react-router-dom'
import { daysRemaining, truncate, useGlobalState } from '../store'
import { useState } from 'react'

const Proposals = () => {
    const [data] = useGlobalState('proposals')
    const [proposals, setProposals] = useState(data)
    const [activeTab, setActiveTab] = useState('all')

    const active = `px-4 py-2.5 bg-orange-500 border border-orange-500 font-medium text-xs text-[#efe4d5]
    leading-tight uppercase shadow-md shadow-grey-400 hover:bg-orange-700 
    hover:shadow-lg transition duration-150 ease-in-out`

    const deactive = `bg-transport border border-orange-500 px-4 py-2.5 font-medium text-xs text-orange-500
    leading-tight uppercase shadow-md shadow-grey-400 hover:bg-orange-700 hover:text-[#efe4d5]
    hover:shadow-lg transition duration-150 ease-in-out`

    const getAll = () => {
        setProposals(data);
        setActiveTab('all');
    }
    const getOpened = () => {
        setProposals(data.filter(
        (proposal) => new Date().getTime() < Number(proposal.duration) + '000'));
        setActiveTab('opened');
    }
    const getClosed = () => {
        setProposals(data.filter(
        (proposal) => new Date().getTime() > Number(proposal.duration) + '000'));
        setActiveTab('closed');
    }
    
  return (
    <div className="flex flex-col p-8">
        <div className="flex justify-center items-center" role="group">
            <button aria-current="page" onClick={getAll} className={`rounded-l-full ${activeTab === 'all' ? active : deactive}`}>All</button>
            <button aria-current="page" onClick={getOpened} className={`${activeTab === 'opened' ? active : deactive}`}>Open</button>
            <button  aria-current="page" onClick={getClosed} className={`rounded-r-full ${activeTab === 'closed' ? active : deactive}`}>Closed</button>
        </div>
        <div className="overflow-x-auto">
            <div className="py-2 inline-block min-w-full">
                <div className="h-[calc(100vh_-_20rem)] overflow-y-auto shadow-md rounded-md">
                    <table className="min-w-full">
                        <thead className="border-b border-orange-700">
                            <tr>
                                <th scope="col" className="text-sm font-medium px-6 py-4 text-left">
                                    Proposer
                                </th>
                                <th scope="col" className="text-sm font-medium px-6 py-4 text-left">
                                    Title
                                </th>
                                <th scope="col" className="text-sm font-medium px-6 py-4 text-left">
                                    Expires
                                </th>
                                <th scope="col" className="text-sm font-medium px-6 py-4 text-left">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {proposals.map((proposal) => (
                                <tr key={proposal.id} className='border-b'>
                                <td className="text-sm font-light px-6 py-4 whitespace-nowrap">
                                   <div className="flex justify-start items-center space-x-2">
                                       <Identicon string={proposal.beneficiary.toLowerCase()} size={25} className="h-10 w-10 object-contain rounded-full"/>
                                           <span>{truncate(proposal.beneficiary, 4, 4, 11)}</span>
                                   </div>
                               </td>
                               <td className="text-sm font-light px-6 py-4 whitespace-nowrap">{proposal.title.substring(0, 80) + '...'}</td>
                               <td className="text-sm font-light px-6 py-4 whitespace-nowrap">
                                   {new Date().getTime() > Number(proposal.duration + '000') ? 'Expired' : daysRemaining(proposal.duration)}
                               </td>
                               <td className="text-sm font-light px-6 py-4 whitespace-nowrap space-x-2">
                                   <Link  to={`/proposal/` + proposal.id}
                                       className="px-4 py-2.5 bg-orange-500 border border-orange-500 font-medium text-[#efe4d5]
                                       leading-tight uppercase shadow-md shadow-grey-400 hover:bg-orange-700 hover:text-black
                                       hover:shadow-lg transition duration-150 ease-in-out rounded-full">View
                                   </Link>
                                   {new Date().getTime() > Number(proposal.duration) + '000' ? (proposal.upvotes > proposal.downvotes ? (<button className="px-4 py-2.5 bg-green-600 border border-green-600 font-medium text-[#efe4d5]
                                   leading-tight uppercase shadow-md shadow-grey-400 transition duration-150 ease-in-out rounded-full">
                                       Approved
                                   </button>) : (<button className="px-4 py-2.5 bg-red-600 border border-red-600 font-medium text-[#efe4d5]
                                   leading-tight uppercase shadow-md shadow-grey-400 transition duration-150 ease-in-out rounded-full">
                                       Rejected
                                   </button>) ) : null}
                               </td>
                               </tr>
                            ))} 
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <img className="text-center mx-auto items-center pr-4 space-x-3" src="https://images.squarespace-cdn.com/content/v1/62cd81ee2ae46a3782bd19cb/58889aa6-6f1a-4070-b96c-6cde74632ff8/Coffee+Club+Round+Logo_Dark+FINAL.png?format=750w" width={100}/>
        <p className='text-center text-xs'>Not actually associated with Princeton Coffee Club in any way.</p>
    </div>
  )
}

const Proposal = ({proposal }) => {
    
}

export default Proposals