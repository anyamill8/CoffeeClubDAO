const DominionDAO = artifacts.require('DominionDAO')
const CoffeeFriend = artifacts.require('CoffeeFriend')

module.exports = async function (deployer, network, accounts) {
    const initialOwner = accounts[0];

    await deployer.deploy(DominionDAO)
    await deployer.deploy(CoffeeFriend, initialOwner)

}