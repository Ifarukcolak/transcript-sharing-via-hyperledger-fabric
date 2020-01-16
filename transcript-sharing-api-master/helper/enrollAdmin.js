const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network')
const fs = require('fs');
const path = require('path');
const { getDesktopPath } = require('../config');

async function main(org) {
    try {
        let ccpPath, certificateAuthoritiesName, walletPath,mspId;
        if (org == 'itu') {
            ccpPath = path.join(__dirname, 'org-connection', org, 'connection-org1.json');
            certificateAuthoritiesName = 'ca.org1.example.com';
            walletPath = path.join(getDesktopPath(), 'wallet', org);
            mspId = "Org1MSP"
        } else {
            ccpPath = path.join(__dirname, 'org-connection', org, 'connection-org2.json');
            certificateAuthoritiesName = 'ca.org2.example.com';
            walletPath = path.join(getDesktopPath(), 'wallet', org);
            mspId = "Org2MSP"
        }

        console.log(ccpPath);
        console.log(certificateAuthoritiesName);
        console.log(walletPath);
        console.log(mspId);
    
        let ccpJSON = fs.readFileSync(ccpPath, 'utf8');
        let ccp = JSON.parse(ccpJSON);

        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities[certificateAuthoritiesName];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get('admin');
        if (identity) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: mspId,
            type: 'X.509',
        };
        await wallet.put('admin', x509Identity);
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        process.exit(1);
    }
}

main('itu');
main('ytu');
