import * as ethers from 'ethers';


(async () => {
  // Define your variables
  const mnemonic="some mnemonic";
  // Create an HDNode from the mnemonic
  const ethersWallet = ethers.Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/0");

  const fid = 9802; // Replace with actual FID
  const signerAddress = '0xbFbbeDd977a055B8550fE35331069caBD8a4B265'; // Replace with actual signer address

  const header = { 
    fid, // FID of the account
    type: 'custody', 
    signer: signerAddress // custody address of the account
  };

  const encodedHeader = Buffer.from(JSON.stringify(header), 'utf-8').toString('base64url');
  console.log('Encoded Header:', encodedHeader);

  const payload = { domain: 'https://my-frames-v2-demo.vercel.app/' };
  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64url');
  console.log('Encoded Payload:', encodedPayload);

  // Initialize a signer
  const privateKey = ethersWallet.privateKey; // Replace with your actual private key
  const wallet = new ethers.Wallet(privateKey);

  // Sign the message
  const message = `${encodedHeader}.${encodedPayload}`;
  const signature = await wallet.signMessage(message);
  console.log('Signature:', signature);

  const encodedSignature = Buffer.from(JSON.stringify(signature), 'utf-8').toString('base64url');

  // Compact JSON
  const jsonJfs = {
    header: encodedHeader,
    payload: encodedPayload,
    signature: encodedSignature
  };
  console.log('JSON JFS:', jsonJfs);
})();