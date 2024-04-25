
# Coffee Club DAO

Visit this URL in your browser (https://anyamill8.github.io/CoffeeClubDAO/) to open the Coffee Club DAO. 

## Introduction
Inspired by K-Pop groups' use of blckchain tools to drive engagement, we sought to create a decentralized platform to draw the Princeton community together. With Coffee Club as our focus, we created a fully functional DAO which blends art, commerce, and campus culture by rewarding frequent cusotmers with NFTs and promoting proposals on topics ranging from drink flavors to open mic performers. In doing so, we define the social DAO as one whose objective is developing community, rather than spending funds. 

## Background
Although we are not affiliated with the Princeton University Coffee Club in any way, the Coffee Club DAO is an application of the concepts and principles of a DAO (Decentralized Autonomous Organization) to a social setting using Coffee Club as an example. Typically, DAOs are used for decentralized governance related to a particular Web3 token. Members can join by contributing a certain amount of this token and make decisions by raising and voting on proposals. Once a proposal is passed, the creator of the proposal is given funds to enact the change they believe to be necessary. All information, including expired proposals and voter decisions, are stored within the DAO to increase transparency. 

While the Coffee Club DAO uses similar principles, it primarily focuses on community engagement, as opposed to economic decision making. Instead of governing a particular token, the Coffee Club DAO is used to govern the social aspects of Coffee Club. What menu items should be available, what artists should perform, and many more decisions can be made communally using the DAO. While any individual can raise a proposal, no funds are paid out to the proposer, but instead funds are used by the Coffee Club to put the particular proposals into action. In its essence, the Coffee Club DAO is a social experiment, supplemented with Web3 technology and principles. 

Learn more about how to use the Coffee Club DAO by visiting its "Read the Docs" page.

## Example Use
We image the use of the Coffee Club DAO to be the following:
1. When you purchase a coffee at the Coffee Club, a Coffee Club employee will use the "Buy Coffee" button to implement the transaction (using ETH). For the sake of example, the "Buy Coffee" button is avaliable to the user on this website so they can simulate its use.
2. Once you have reached 10 coffee purchases, a "Claim NFT" button will appear in the right hand corner. Select this button to get your Coffee Friend NFT.
3. Now that you have a Coffee Friend NFT, you can contribute and make decisions within the DAO. Input the number of Coffee Friends you would like to contribute and hit the "contribute" button. Voting power will be proportional to the number of Coffee Friend NFTs you have contributed.
4. The ability to create proposals, as well as view and vote on proposals, is now open to you as a DAO stakeholder. Enjoy contributing to the Coffee Club community!

## Code
The solidity code that governs our smart contracts can be found in /src/contracts. The "DominionDAO" contract handles the DAO-related actions (such as contributing, proposing, and voting) while the "CoffeeFriend" contract handles the count of Coffee Club points and the minting and transfer of Coffee Friend NFTs. To see how these contracts were integrated into our backend, view the Blockchain.services.jsx file in the src directory where we define many functions to assist in contributing, buying coffee, claiming NFTs, voting, and proposing. To view front end code, visit /src/components. 

### Sources
The front end code in this website, as well as the skeleton of the DAO contract, was guided by this video (https://www.youtube.com/watch?v=Gm442Ihv1GU) by @DappMentors

