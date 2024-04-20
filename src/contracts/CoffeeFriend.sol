// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.11;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract CoffeeFriend is ERC721, ERC721Enumerable, Ownable {

    mapping(address => uint256) private _coffeePoints;

    uint256 private currentTokenID;

    constructor(address initialOwner)
        ERC721("CoffeeFriend", "CoffeeFriend")
        Ownable(initialOwner)
    { currentTokenID = 0;}

     function mintCoffeeNFT() external {
        // Check caller has 10 coffee points
        require(_coffeePoints[msg.sender] >= 10, "insuff");

        // reset coffee points for caller
        _coffeePoints[msg.sender] = _coffeePoints[msg.sender] - 10;

        // increment tokenID
        currentTokenID += 1;

        // Finally mint.
        _mint(msg.sender, currentTokenID);
    }

    // get coffee point for ETH
    function completeCoffeeBuyWithEth() public payable {
        // 0.00074 ETH
        require(
            msg.value == 740000000000000,
            "You need to send exactly 0.00074 ETH"
        ); // 0.00074ETH is represented in wei
        _coffeePoints[msg.sender] += 1; // Increment coffee points of the sender by 1
    }

    function addCoffeePoints(address account, uint256 amount) public onlyOwner {
        _coffeePoints[account] += amount;
    }

    function getCoffeePoints(address account) public view returns (uint256) {
        return _coffeePoints[account];
    }

    function generateSVG(uint256 tokenId) public pure returns (string memory) {
        string memory svg = string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 300 300"><path fill="#9AE8CE" d="m73.363 121.482 9.071 98.267h135.134l9.071-98.267z"/><path fill="#AA6148" d="M168.473 189.75c-14.428 14.43-34.401 17.857-44.605 7.656-10.194-10.203-6.773-30.172 7.662-44.601 14.43-14.432 34.395-17.858 44.598-7.658 10.203 10.204 6.781 30.173-7.655 44.603z"/><path fill="#BC715C" d="M137.01 158.286c13.11-13.112 30.764-17.101 41.54-10.078-.707-1.086-1.488-2.126-2.423-3.061-10.203-10.2-30.168-6.773-44.598 7.658-14.436 14.428-17.857 34.398-7.662 44.601.935.935 1.975 1.714 3.062 2.423-7.018-10.777-3.035-28.434 10.081-41.543z"/><path fill="#BC715C" d="M128.473 198.731c-.597 0-1.19-.006-1.785-.018a4.456 4.456 0 0 1-4.368-4.545c.044-2.437 2.03-4.385 4.445-4.385l.084.001c10.06.173 17.987.328 20.183-19.954 2.41-22.215 18.472-26.52 26.65-25.702 2.442.248 4.224 2.438 3.98 4.891-.246 2.443-2.432 4.24-4.844 3.997-1.549-.117-14.935-.694-16.94 17.781-2.711 25.021-14.815 27.934-27.405 27.934z"/><path fill="#9AE8CE" d="M227.906 55.466s-1.603-15.118-11.976-15.118h-50.193s-8.259-11.591-18.629-11.591H93.232c-15.685 0-21.136 26.709-21.136 26.709-6.679 0-12.094 5.415-12.094 12.094s5.416 12.094 12.094 12.094h155.81c6.679 0 12.094-5.415 12.094-12.094s-5.415-12.094-12.094-12.094z"/><path fill="#AEF4DB" d="M78.143 67.561c0-6.679 5.416-12.094 12.094-12.094 0 0 5.451-26.709 21.136-26.709H93.232c-15.685 0-21.136 26.709-21.136 26.709-6.679 0-12.094 5.415-12.094 12.094s5.416 12.094 12.094 12.094h18.141c-6.678 0-12.094-5.415-12.094-12.094z"/><path fill="#F4F4F4" d="M91.841 271.243h116.32l4.875-51.494H86.966zM226.302 79.655H73.699l3.963 41.827H222.34z"/><path fill="#AEF4DB" d="m73.363 121.482 9.071 98.267h19.148l-9.071-98.267z"/><path fill="#F9F9F9" d="m86.966 219.749 4.875 51.494h19.148l-4.875-51.494zM73.699 79.655l3.963 41.827H96.81l-3.962-41.827z"/><g><path fill="#161616" d="M227.904 84.19H72.096c-9.17 0-16.63-7.46-16.63-16.63s7.46-16.63 16.63-16.63h155.808c9.17 0 16.63 7.46 16.63 16.63s-7.46 16.63-16.63 16.63zM72.096 60.002c-4.168 0-7.559 3.391-7.559 7.559s3.391 7.559 7.559 7.559h155.808c4.168 0 7.559-3.391 7.559-7.559s-3.391-7.559-7.559-7.559H72.096z"/><path fill="#161616" d="M227.904 60.002H72.096a4.536 4.536 0 0 1-4.444-5.442c.253-1.239 6.41-30.338 25.578-30.338h53.876c9.791 0 17.641 7.86 20.814 11.591h48.01c11.408 0 15.729 12.053 16.485 19.175a4.536 4.536 0 0 1-4.511 5.014zM78.091 50.931H222.14c-1.076-2.926-2.981-6.047-6.211-6.047h-50.193a4.539 4.539 0 0 1-3.694-1.903c-1.936-2.688-8.405-9.688-14.936-9.688H93.23c-7.98 0-12.856 10.813-15.139 17.638zM138.498 207.741c-7.2 0-13.779-2.318-18.59-7.126-11.953-11.963-8.514-34.848 7.662-51.017 16.172-16.172 39.057-19.611 51.011-7.658 6.006 6.007 8.377 14.776 6.676 24.691-1.603 9.341-6.692 18.691-14.331 26.327v.001c-9.665 9.665-21.731 14.782-32.428 14.782zm21.402-63.994c-8.222 0-17.958 4.308-25.916 12.266-12.427 12.421-15.934 29.908-7.661 38.189 8.279 8.275 25.768 4.766 38.191-7.658v-.002c6.323-6.32 10.516-13.937 11.803-21.446 1.19-6.932-.285-12.877-4.149-16.742-3.118-3.116-7.432-4.607-12.268-4.607z"/><path fill="#161616" d="M125.92 198.911a4.536 4.536 0 0 1-.137-9.069l.847-.025c10.884-.323 17.454-.518 19.633-20.067 2.489-22.328 18.8-26.619 27.081-25.785a4.533 4.533 0 0 1 4.051 4.972c-.253 2.483-2.476 4.312-4.941 4.054-1.566-.134-15.114-.741-17.176 17.762-3.05 27.376-17.095 27.794-28.379 28.129l-.836.027c-.047.002-.096.002-.143.002zM208.159 275.778h-14.756a4.535 4.535 0 1 1 0-9.07h10.63l4.017-42.423H91.95l4.017 42.423h76.513a4.535 4.535 0 1 1 0 9.07H91.841a4.535 4.535 0 0 1-4.515-4.107l-4.877-51.494a4.533 4.533 0 0 1 4.514-4.964h126.071a4.533 4.533 0 0 1 4.514 4.964l-4.876 51.494a4.532 4.532 0 0 1-4.513 4.107zM222.34 126.017H77.66a4.535 4.535 0 0 1-4.515-4.107l-3.961-41.827a4.534 4.534 0 0 1 4.514-4.964h152.601a4.533 4.533 0 0 1 4.514 4.964l-3.961 41.827a4.531 4.531 0 0 1-4.512 4.107zm-140.553-9.071h136.426l3.102-32.756H78.685l3.102 32.756z"/><path fill="#161616" d="M217.23 224.284H82.097a4.535 4.535 0 0 1-4.516-4.119l-5.618-60.851a4.536 4.536 0 0 1 4.1-4.933c2.485-.221 4.702 1.605 4.932 4.1l5.237 56.732h126.862l8.232-89.196H78l1.064 11.541a4.535 4.535 0 0 1-4.1 4.932c-2.468.239-4.702-1.603-4.933-4.1l-1.522-16.492a4.535 4.535 0 0 1 4.516-4.951H226.3a4.534 4.534 0 0 1 4.516 4.951l-9.071 98.267a4.533 4.533 0 0 1-4.515 4.119z"/></g>',
                '<text x="50%" y="99%" fill="#000000" text-anchor="middle" style="&#10;    font-size: 20px;&#10;"> Coffee Friend #',
                Strings.toString(tokenId),
                "</text></svg>"
            )
        );
        return svg;
    }

    function tokenURI(uint256 tokenId)
        public
        pure
        override
        returns (string memory)
    {
        string memory svg = generateSVG(tokenId);
        string memory svgBase64 = string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                Base64.encode(bytes(svg))
            )
        );

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        "{",
                        '"name": "Coffee Friend #',
                        Strings.toString(tokenId),
                        '", ',
                        '"description": "Welcome to the Coffee Club! This is Coffee Friend number ',
                        Strings.toString(tokenId),
                        '",', //comma added here
                        '"image": "',
                        svgBase64,
                        '"',
                        "}"
                    )
                )
            )
        );
        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function getTokens(address account) external view returns (uint256[] memory) {
        uint256 totalTokens = balanceOf(account);
        uint256[] memory tokens = new uint256[](totalTokens);

        for (uint256 i = 0; i < totalTokens; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(account, i);
            tokens[i] = tokenId;
        }
        return tokens;
    }

}