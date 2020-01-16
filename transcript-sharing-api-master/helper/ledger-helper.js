const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const { getDesktopPath } = require('../config');

module.exports = {
    getContract: async function (username, org) {
        try {
            let ccpPath, walletPath;
            console.log(`username  : ${username} , org : ${org}`);
            if (org == 'itu') {
                ccpPath = path.join(__dirname, 'org-connection', org, 'connection-org1.json');
                walletPath = path.join(getDesktopPath(), 'wallet', org);
            }
            else {
                ccpPath = path.join(__dirname, 'org-connection', org, 'connection-org2.json');
                walletPath = path.join(getDesktopPath(), 'wallet', org);
            }
            console.log(`ccpPath  : ${ccpPath} , walletPath : ${walletPath}`);
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const identity = await wallet.get(username);
            if (!identity) {
                console.log(`An identity for the user ${username} does not exist in the wallet`);
                console.log('Run the registerUser.js application before retrying');
                return;
            }
            console.log('User verified.')

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccpPath, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });
            console.log('Gateway connection is established.')

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');

            // Get the contract from the network.
            const contract=network.getContract('fabcar');
            return {contract:contract, gateway:gateway};
        }
        catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            process.exit(1);
        }
    },
    registerUser: async function (username, org) {
        try {
            let ccpPath, walletPath,affiliation,mspId;

            if (org == 'itu') {
                ccpPath = path.join(__dirname, 'org-connection', org, 'connection-org1.json');
                walletPath = path.join(getDesktopPath(), 'wallet', org);
                affiliation='org1.department1';
                mspId ='Org1MSP'
            }
            else {
                ccpPath = path.join(__dirname, 'org-connection', org, 'connection-org2.json');
                walletPath = path.join(getDesktopPath(), 'wallet', org);
                affiliation='org2.department1';
                mspId ='Org2MSP'
            }

            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const userIdentity = await wallet.get(username);
            if (userIdentity) {
                console.log(`An identity for the user ${username} already exists in the wallet`);
                return {isSuccess:false,message:`An identity for the user ${username} already exists in the wallet`} ;
            }

            // Check to see if we've already enrolled the admin user.
            const adminIdentity = await wallet.get('admin');
            if (!adminIdentity) {
                console.log('An identity for the admin user "admin" does not exist in the wallet');
                console.log('Please, consult your admin user');
                return {isSuccess:false,message:'An identity for the admin user "admin" does not exist in the wallet'};
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });

            // Get the CA client object from the gateway for interacting with the CA.
            const client = gateway.getClient();
            const ca = client.getCertificateAuthority();
            const adminUser = await client.getUserContext('admin', false);

            // Register the user, enroll the user, and import the new identity into the wallet.
            const secret = await ca.register({ affiliation: affiliation, enrollmentID: username, role: 'client' }, adminUser);
            const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret });
            const x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: mspId,
                type: 'X.509',
            };
            await wallet.put(username, x509Identity);
            console.log(`Successfully registered and enrolled admin user ${username} and imported it into the wallet`);
            return {isSuccess:true,message:'Successfully registered.'};

        } catch (error) {
            console.error(`Failed to register user ${username}: ${error}`);
            return {isSuccess:false,message:error};;
        }
    }
}