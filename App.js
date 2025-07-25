// App.js
import React, { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import {
  useSignAndExecuteTransaction,
  ConnectButton,
  useCurrentAccount
} from '@mysten/dapp-kit';
import './App.css';

const LoyaltyCardPage = () => {
  const currentAccount = useCurrentAccount();
  const [loading, setLoading] = useState(false);
  const [packageId, setPackageId] = useState('');
  const [mintForm, setMintForm] = useState({
    customerId: '',
    imageUrl: ''
  });

  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const handleMintChange = (e) => {
    setMintForm({ ...mintForm, [e.target.name]: e.target.value });
  };

  const mintLoyalty = async () => {
    if (!currentAccount) {
      alert('Please connect your wallet');
      return;
    }
    if (!packageId.trim()) {
      alert('Please enter a valid Package ID');
      return;
    }
    if (!mintForm.imageUrl.trim()) {
      alert('Please enter an Image URL');
      return;
    }
    try {
      setLoading(true);
      const tx = new Transaction();
      tx.moveCall({
        target: `${packageId}::loyalty_card::mint_loyalty`,
        arguments: [
          tx.pure.address(mintForm.customerId),
          tx.pure.string(mintForm.imageUrl)
        ]
      });

      await signAndExecute({ transaction: tx });
      setMintForm({ customerId: '', imageUrl: '' });
      alert('Minting successful!');
    } catch (error) {
      console.error('Error minting loyalty card:', error);
      alert(`Minting failed: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Mint Your NFT on SUI</h1>
      <ConnectButton />

      <div className="package-input">
        <label>Package ID</label>
        <input
          type="text"
          value={packageId}
          onChange={(e) => setPackageId(e.target.value)}
          placeholder="Enter Package ID"
        />
      </div>

      <section className="form-section">
        <label>Wallet Address</label>
        <input
          type="text"
          name="customerId"
          value={mintForm.customerId}
          onChange={handleMintChange}
          placeholder="Enter Customer Sui Address"
        />

        <label>Image URL</label>
        <input
          type="text"
          name="imageUrl"
          value={mintForm.imageUrl}
          onChange={handleMintChange}
          placeholder="Enter Image URL"
        />

        {/* Live Image Preview */}
        {mintForm.imageUrl && (
          <div style={{ margin: '10px 0' }}>
            <strong>Image Preview:</strong><br />
            <img
              src={mintForm.imageUrl}
              alt="Preview"
              style={{
                width: '200px',
                height: 'auto',
                border: '1px solid #ccc',
                padding: 5
              }}
              onError={e => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/200x150?text=Invalid+Image+URL';
              }}
            />
          </div>
        )}

        <button
          onClick={mintLoyalty}
          disabled={
            loading ||
            !mintForm.customerId.trim() ||
            !mintForm.imageUrl.trim() ||
            !packageId.trim()
          }
        >
          {loading ? 'Minting...' : 'Mint your NFT'}
        </button>
      </section>
    </div>
  );
};



export default LoyaltyCardPage;
