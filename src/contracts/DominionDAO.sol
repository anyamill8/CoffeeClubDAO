// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

contract DominionDAO is ReentrancyGuard, AccessControl {
    bytes32 private immutable CONTRIBUTOR_ROLE = keccak256("CONTRIBUTOR");
    bytes32 private immutable STAKEHOLDER_ROLE = keccak256("STAKEHOLDER");
    uint256 immutable MIN_STAKEHOLDER_CONTRIBUTION = 1;
    uint32 immutable MIN_VOTE_DURATION = 1 weeks;
    uint256 totalProposals;
    uint256 public daoBalance;

    mapping(uint256 => ProposalStruct) private raisedProposals;
    mapping(address => uint256[]) private stakeholderVotes;
    mapping(uint256 => VotedStruct[]) private votedOn;
    mapping(address => uint256) private contributors;
    mapping(address => uint256) private stakeholders;

    struct ProposalStruct {
        uint256 id;
        uint256 duration;
        uint256 upvotes;
        uint256 downvotes;
        string title;
        string description;
        bool passed;
        bool paid;
        address payable beneficiary; // beneficiary not used
        address proposer;
        address executor;
    }

    struct VotedStruct {
        address voter;
        uint256 timestamp;
        bool choosen;
    }

    event Action(
        address indexed initiator,
        bytes32 role,
        string message,
        address indexed beneficiary
    );

    // verify user is stakeholder
    modifier stakeholderOnly(string memory message) {
        require(hasRole(STAKEHOLDER_ROLE, msg.sender), message);
        _;
    }

    // verify user has contributed
    modifier contributorOnly(string memory message) {
        require(hasRole(CONTRIBUTOR_ROLE, msg.sender), message);
        _;
    }

    // allow stakeholders to make a DAO proposal
    function createProposal(
        string calldata title,
        string calldata description,
        address beneficiary
    )external
     stakeholderOnly("Proposal Creation Allowed for Stakeholders only")
     returns (ProposalStruct memory)
    {
        uint256 proposalId = totalProposals++;
        ProposalStruct storage proposal = raisedProposals[proposalId];

        proposal.id = proposalId;
        proposal.proposer = payable(msg.sender);
        proposal.title = title;
        proposal.description = description;
        proposal.beneficiary = payable(beneficiary);
        proposal.duration = block.timestamp + MIN_VOTE_DURATION;

        emit Action(
            msg.sender,
            CONTRIBUTOR_ROLE,
            "PROPOSAL RAISED",
            beneficiary
        );

        return proposal;
    }

    // allow stakeholder to vote on proposals
    function performVote(uint256 proposalId, bool choosen)
        external
        stakeholderOnly("Unauthorized: Stakeholders only")
        returns (VotedStruct memory)
    {
        ProposalStruct storage proposal = raisedProposals[proposalId];

        handleVoting(proposal);

        // voting power added proportional to user contribution
        uint256 votingPower = stakeholders[msg.sender];

        if (choosen) proposal.upvotes+= votingPower;
        else proposal.downvotes+= votingPower;

        stakeholderVotes[msg.sender].push(proposal.id);

        votedOn[proposal.id].push(
            VotedStruct(
                msg.sender,
                block.timestamp,
                choosen
            )
        );

        emit Action(
            msg.sender,
            STAKEHOLDER_ROLE,
            "PROPOSAL VOTE",
            proposal.beneficiary
        );

        return VotedStruct(
                msg.sender,
                block.timestamp,
                choosen
            );
    }

    // helper function for voting
    function handleVoting(ProposalStruct storage proposal) private {
        if (
            proposal.passed ||
            proposal.duration <= block.timestamp
        ) {
            proposal.passed = true;
            revert("Proposal duration expired");
        }

        uint256[] memory tempVotes = stakeholderVotes[msg.sender];
        for (uint256 votes = 0; votes < tempVotes.length; votes++) {
            if (proposal.id == tempVotes[votes])
                revert("Double voting not allowed");
        }
    }

    // allow user to contribute multiple NFTs to DAO at once
    function contribute(uint256 numNFTs, uint256[] memory _tokenIDs, address contractNFT) external nonReentrant returns (uint256) {
        require(numNFTs > 0, "Please provide at least one NFT");
        require(numNFTs <= _tokenIDs.length, "Not enough NFTs");

        for (uint256 i = 0; i < numNFTs; i++) {
            uint256 tokenId = _tokenIDs[i];
            require(IERC721(contractNFT).ownerOf(tokenId) == msg.sender, "You do not own this NFT");
            IERC721(contractNFT).transferFrom(msg.sender, address(this), tokenId);
        }  

        if (!hasRole(STAKEHOLDER_ROLE, msg.sender)) {
            uint256 totalContribution =
                contributors[msg.sender] + numNFTs;

            if (totalContribution >= MIN_STAKEHOLDER_CONTRIBUTION) {
                stakeholders[msg.sender] = totalContribution;
                contributors[msg.sender] += numNFTs;
                _grantRole(STAKEHOLDER_ROLE, msg.sender);
                _grantRole(CONTRIBUTOR_ROLE, msg.sender);
            } else {
                contributors[msg.sender] += numNFTs;
                _grantRole(CONTRIBUTOR_ROLE, msg.sender);
            }
        } else {
            contributors[msg.sender] += numNFTs;
            stakeholders[msg.sender] += numNFTs;
        }
        
        daoBalance += numNFTs;

        emit Action(
            msg.sender,
            STAKEHOLDER_ROLE,
            "CONTRIBUTION RECEIVED",
            address(this)
        );

        return daoBalance;
    }

    function getProposals()
        external
        view
        returns (ProposalStruct[] memory props)
    {
        props = new ProposalStruct[](totalProposals);

        for (uint256 i = 0; i < totalProposals; i++) {
            props[i] = raisedProposals[i];
        }
    }

    function getProposal(uint256 proposalId)
        external
        view
        returns (ProposalStruct memory)
    {
        return raisedProposals[proposalId];
    }
    
    function getVotesOf(uint256 proposalId)
        external
        view
        returns (VotedStruct[] memory)
    {
        return votedOn[proposalId];
    }

    function getStakeholderVotes()
        external
        view
        stakeholderOnly("Unauthorized: not a stakeholder")
        returns (uint256[] memory)
    {
        return stakeholderVotes[msg.sender];
    }

    function getStakeholderBalance()
        external
        view
        stakeholderOnly("Unauthorized: not a stakeholder")
        returns (uint256)
    {
        return stakeholders[msg.sender];
    }

    function isStakeholder() external view returns (bool) {
        return stakeholders[msg.sender] > 0;
    }

    function getContributorBalance()
        external
        view
        contributorOnly("Denied: User is not a contributor")
        returns (uint256)
    {
        return contributors[msg.sender];
    }

    function isContributor() external view returns (bool) {
        return contributors[msg.sender] > 0;
    }

    function getBalance() external view returns (uint256) {
        return contributors[msg.sender];
    }

    // allow DAO to payout NFTs if needed
    function payTo(
        address to, 
        uint256 amount
    ) internal returns (bool) {
        (bool success,) = payable(to).call{value: amount}("");
        require(success, "Payment failed");
        return true;
    }
}