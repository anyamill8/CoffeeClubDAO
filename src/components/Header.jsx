import { Link } from 'react-router-dom'
import { connectWallet, buyCoffee, claimNFT } from '../Blockchain.services'
import { useGlobalState, truncate } from '../store'

const Header = () => {
const [connectedAccount] = useGlobalState('connectedAccount')
const [coffeePoints] = useGlobalState('coffeePoints')

  return (
    <div className="sticky top-0 z-50 text-black"> 
        <nav 
            className="navbar navbar-expand-lg shadow-md py-2 
            relative flex items-center w-full justify-between bg-[#efe4d5]"
        >
            <div 
                className="px-6 w-full flex flex-wrap items-center 
                justify-between"
            >
                <div className="grow flex justify-between items-center p-2">
                    <Link to="/" className="flex justify-start items-center pr-4 space-x-3">
                        <img className="cursor-pointer" src="https://images.squarespace-cdn.com/content/v1/62cd81ee2ae46a3782bd19cb/c35ea55e-a78b-40d5-8d28-ef8b8e757226/Coffee+Club+web+logo+banner+v1.png?format=1500w" width={150}/>
                    </Link>
                    <div><h1 className="lg:text-5xl md:text-3xl sm:text-xl"><strong>Coffee Club DAO</strong></h1></div>
                    <div className="flex justify-center items-center space-x-5">
                        {connectedAccount ? (<button className="px-4 py-2.5 bg-orange-500 font-medium 
                        text-sm text-[#efe4d5] leading-tight uppercase rounded-full shadow-md 
                        shadow-grey-400 hover:bg-orange-700 hover:text-black hover:shadow-lg
                        transition duration-150 ease-in-out"
                        >
                            {truncate(connectedAccount, 4, 4, 11)}
                        </button>) : (<button className="px-4 py-2.5 bg-orange-500 font-medium 
                        text-sm text-[#efe4d5] leading-tight uppercase rounded-full shadow-md 
                        shadow-grey-400 hover:bg-orange-700 hover:text-black hover:shadow-lg
                        transition duration-150 ease-in-out"
                        onClick={() => connectWallet()}
                        >
                            Connect Wallet
                        </button>)}
                        
                        <button className="px-4 py-2.5 bg-orange-500 font-medium 
                        text-sm text-[#efe4d5] leading-tight uppercase rounded-full shadow-md 
                        shadow-grey-400 hover:bg-orange-700 hover:text-black hover:shadow-lg
                        transition duration-150 ease-in-out" onClick={ () => buyCoffee(0.00074)}
                        >
                            Buy Coffee
                        </button>
                       {coffeePoints >= 10 ? ( <button className="px-4 py-2.5 bg-green-600 font-medium 
                        text-sm text-[#efe4d5] leading-tight uppercase rounded-full shadow-md 
                        shadow-grey-400 hover:bg-green-700 hover:text-black hover:shadow-lg
                        transition duration-150 ease-in-out" onClick={ () => claimNFT()}
                        >
                            Claim NFT!
                        </button>) : null}
                    </div>
                </div>
            </div>
        </nav>
    </div>
  )
}

export default Header