import Identicon from 'react-identicons'
import moment from 'moment'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { truncate } from '../store'
import { listVoters } from '../Blockchain.services'


const Voters = () => {

    const [voters, setVoters] = useState([])
    const [data, setData] = useState([])
    const { id } = useParams()
    const [activeTab, setActiveTab] = useState('all')


    const timeAgo = (timestamp) => moment(Number(timestamp + '000')).fromNow()
    
    const active = `px-4 py-2.5 bg-orange-500 border border-orange-500 font-medium text-xs text-[#efe4d5]
    leading-tight uppercase shadow-md shadow-grey-400 hover:bg-orange-700 
    hover:shadow-lg transition duration-150 ease-in-out`

    const deactive = `bg-transport border border-orange-500 px-4 py-2.5 font-medium text-xs text-orange-500
    leading-tight uppercase shadow-md shadow-grey-400 hover:bg-orange-700 hover:text-[#efe4d5]
    hover:shadow-lg transition duration-150 ease-in-out`

    useEffect(async () => {
        await listVoters(id).then((res) => {
          setVoters(res)
          setData(res)
        })
      }, [id])
    
      const getAll = () => {
        setVoters(data)
        setActiveTab('all');
      }
    
      const getAccepted = () => {
        setVoters(data.filter((vote) => vote.choosen))
        setActiveTab('accepted');
      }
    
      const getRejected = () => {
        setVoters(data.filter((vote) => !vote.choosen))
        setActiveTab('rejected');
      }

  return (
    <div className="flex flex-col p-8">
        <div className="flex justify-center items-center" role="group">
            <button aria-current= 'page' className={`rounded-l-full ${activeTab === 'all' ? active : deactive}`} onClick={getAll}>All</button>
            <button aria-current= 'page' className={`${activeTab === 'accepted' ? active : deactive}`} onClick={getAccepted}>Acceptees</button>
            <button aria-current= 'page' className={`rounded-r-full ${activeTab === 'rejected' ? active : deactive}`} onClick={getRejected}>Rejectees</button>
        </div>
        <div className="overflow-x-auto">
            <div className="py-2 inline-block min-w-full">
                <div className="h-[calc(100vh_-_20rem)] overflow-y-auto shadow-md rounded-md">
                    <table className="min-w-full">
                        <thead className="border-b border-orange-700">
                            <tr>
                                <th scope="col" className="text-sm font-medium px-6 py-4 text-left">
                                    Voter
                                </th>
                                <th scope="col" className="text-sm font-medium px-6 py-4 text-left">
                                    Voted
                                </th>
                                <th scope="col" className="text-sm font-medium px-6 py-4 text-left">
                                    Vote
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {voters.map((voter, i) => (
                                <tr>
                                <td className="text-sm font-light px-6 py-4 whitespace-nowrap">
                                    <div className="flex justify-start items-center space-x-2">
                                        <Identicon string={voter.voter.toLowerCase()} size={25} className="h-10 w-10 object-contain
                                        rounded-full"/>
                                        <span>{truncate(voter.voter, 4, 4, 11)}</span>
                                    </div>
                                </td>
                                <td className="text-sm font-light px-6 py-4 whitespace-nowrap">
                                    {timeAgo(voter.timestamp)}
                                </td>
                                <td className="text-sm font-light px-6 py-4 whitespace-nowrap space-x-2">
                                    {voter.choosen? (
                                    <button className="px-4 py-2.5 bg-green-600 border border-green-600 font-medium text-[#efe4d5]
                                    leading-tight uppercase shadow-md shadow-grey-400 
                                    transition duration-150 ease-in-out rounded-full">
                                        Accepted
                                    </button>
                                    ) : (
                                    <button className="px-4 py-2.5 bg-red-600 border border-red-600 font-medium text-[#efe4d5]
                                    leading-tight uppercase shadow-md shadow-grey-400
                                    transition duration-150 ease-in-out rounded-full">
                                        Rejected
                                    </button>
                                    )}
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="py-2 mt-4 text-center">
                {voters.length >= 10 ? (
                <button className="px-4 py-2.5 bg-orange-500 border border-red-600 font-medium text-[#efe4d5]
                        leading-tight uppercase shadow-md shadow-grey-400 hover:text-black hover:bg-orange-700
                        transition duration-150 ease-in-out rounded-full">
                        Load More
                </button>
                ) : null}
            </div>
        </div>
    </div>
  )
}

export default Voters