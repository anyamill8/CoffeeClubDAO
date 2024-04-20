import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
} from 'recharts'
import { getProposal, voteOnProposal } from '../Blockchain.services'
import { useGlobalState, daysRemaining } from '../store'

const ProposalDetails = () => {
  const { id } = useParams()
  const [proposal, setProposal] = useState(null)
  const [data, setData] = useState([])
  const [isStakeholder] = useGlobalState('isStakeholder')

  useEffect(() => {
    retrieveProposal()
  }, [id])

  const retrieveProposal = async () => {
    await getProposal(id).then((res) => {
      setProposal(res)
      setData([
        {
          name: 'Voters',
          Acceptees: res?.upvotes,
          Rejectees: res?.downvotes,
        },
      ])
    })
  }

  const onVote = async (choice) => {
    if (new Date().getTime() > Number(proposal.duration + '000')) {
      toast.warning('Proposal expired!')
      return
    }
    await voteOnProposal(id, choice)
    toast.success('Voted successfully!')

  }

  return (
    <div className="p-8">
      <h2 className="font-semibold text-3xl mb-5">{proposal?.title}</h2>
      <p>
        This proposal currently has {' '}
        <strong>{proposal?.upvotes + proposal?.downvotes == 1 ? '1 vote ' : `${proposal?.upvotes + proposal?.downvotes} votes `}</strong> 
        and will expire in <strong>{daysRemaining(proposal?.duration) == '1 days' ? '1 day' : daysRemaining(proposal?.duration)}</strong>
      </p>
      <hr className="my-6 border-orange-700" />
      <p>{proposal?.description}</p>
      <div className="flex flex-row justify-start items-center w-full mt-4 overflow-auto">
        <BarChart width={730} height={250} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Acceptees" fill="#4caf50" />
          <Bar dataKey="Rejectees" fill="#dc2626" />
        </BarChart>
      </div>
      <div
        className="flex flex-row justify-start items-center space-x-3 mt-4"
        role="group"
      >
        {isStakeholder ? (
          <>
            <button
              type="button"
              className="bg-transport border border-orange-500 px-4 py-2.5 font-medium text-xs text-orange-500
              leading-tight rounded-full uppercase shadow-md shadow-grey-400 hover:bg-green-500 
              hover:shadow-lg hover:text-[#efe4d5] transition duration-150 ease-in-out" 
              onClick={() => onVote(true)}
            >
              Accept
            </button>
            <button
              type="button"
              className="bg-transport border border-orange-500 px-4 py-2.5 font-medium text-xs text-orange-500
          leading-tight rounded-full uppercase shadow-md shadow-grey-400 hover:bg-red-500 
          hover:text-[#efe4d5] hover:shadow-lg transition duration-150 ease-in-out" 
              onClick={() => onVote(false)}
            >
              Reject
            </button>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default ProposalDetails