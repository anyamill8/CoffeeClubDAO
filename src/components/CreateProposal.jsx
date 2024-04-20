import { FaTimes } from "react-icons/fa"
import { useState } from 'react'
import { useGlobalState, setGlobalState } from "../store"
import { raiseProposal } from '../Blockchain.services'
import { toast } from 'react-toastify'

const CreateProposal = () => {
    const [modal] = useGlobalState('modal')
    const [title, setTitle] = useState('')
    const [beneficiary, setBeneficiary] = useState('')
    const [description, setDescription] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title || !description || !beneficiary) return
        const proposal = { title, description, beneficiary }
    
        await raiseProposal(proposal)
        toast.success('Proposal created, reloading in progress...')
        closeModal()
      }
    
      const closeModal = () => {
        setGlobalState('modal', 'scale-0')
        resetForm()
      }
    
      const resetForm = () => {
        setTitle('')
        setBeneficiary('')
        setDescription('')
      }


  return (
    <div className={`fixed top-0 left-0 w-screen h-screen flex items-center 
    justify-center bg-orange-800 bg-opacity-50 transform transition-transform
     duration-300 ${modal} z-50`}
    >
        <div className="bg-[#efe4d5] shadow-lg shadow-gray-500 rounded-xl w-11/12
        md:w-2/5 h-712 p-6">
            <form className="flex flex-col">
                <div className="flex justify-between items-center">
                     <p className="font-semibold"> 
                        Raise Proposal
                     </p>
                     <button type="button" className="border-o bg-transparent focus:outline-none" onClick={closeModal}>
                        <FaTimes/>
                     </button>
                </div>
                <div className="flex justify-between items-center border border-orange-700 rounded-xl mt-5">
                    <input className="block w-full text-sm bg-transparent border-0 focus:outline-none focus:ring-0" 
                    type="text"
                    name="title"
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    required
                    />
                </div>
                <div className="flex justify-between items-center border border-orange-700 rounded-xl mt-5">
                    <input className="block w-full text-sm bg-transparent border-0 focus:outline-none focus:ring-0" 
                    type="text"
                    name="beneficiary"
                    placeholder="Proposer Address"
                    onChange={(e) => setBeneficiary(e.target.value)}
                    value={beneficiary}
                    required
                    />
                </div>
                <div className="flex justify-between items-center border border-orange-700 rounded-xl mt-5">
                    <textarea className="block w-full text-sm bg-transparent border-0 focus:outline-none focus:ring-0" 
                    type="text"
                    name="description"
                    placeholder="Description"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    required
                    />
                </div>
                <button className="px-4 py-2.5 bg-orange-500 mt-5
                text-[#efe4d5] font-medium leading-tight uppercase
                shadow-md shadow-gray-400 rounded-full hover:text-black hover:bg-orange-700
                transition duration-150 ease-in-out" onClick={handleSubmit}
                >Submit Proposal
                </button>
            </form>
        </div>
    </div>
  )
}

export default CreateProposal