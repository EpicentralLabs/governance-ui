import { Connection, PublicKey } from '@solana/web3.js';
import { AccountMetaData } from '@solana/spl-governance';
import { useQuery } from '@tanstack/react-query';
import { getMintDecimalAmountFromNatural } from '@tools/sdk/units';
import { TOKEN_PROGRAM_ID, AccountLayout, MintLayout } from '@solana/spl-token'; 

// Helper function to fetch token account
const fetchTokenAccount = async (connection: Connection, publicKey: PublicKey) => {
  const accountInfo = await connection.getAccountInfo(publicKey);
  if (!accountInfo || !accountInfo.owner.equals(TOKEN_PROGRAM_ID)) return null;

  // Decode token account data using AccountLayout
  const decodedData = AccountLayout.decode(accountInfo.data);
  const mint = decodedData.mint; // Extract the mint address

  return { ...decodedData, mint: new PublicKey(mint) };
};

// Helper function to fetch mint info
const fetchMintInfo = async (connection: Connection, mint: PublicKey) => {
  if (!mint) return null;
  const mintInfo = await connection.getAccountInfo(mint);
  if (!mintInfo) return null;

  // Decode mint account data using MintLayout
  const decodedMintInfo = MintLayout.decode(mintInfo.data); // Decode the mint account data
  return decodedMintInfo; // Return the decoded mint info
};

export const METEORA_INSTRUCTIONS = {
  'M3mxk5W2tt27WGZWpZR7hUpV7c5Hqm8GfwUtbyLJGrj1': {
    // Create Pool instruction
    1: {
      name: 'Create Liquidity Pool',
      accounts: [
        { name: 'Token A Mint' },
        { name: 'Token B Mint' },
        { name: 'Pool Authority' },
        { name: 'Fee Account' },
        { name: 'Pool State' },
        { name: 'Token Program' },
      ],
      getDataUI: (
        connection: Connection,
        data: Uint8Array,
        accounts: AccountMetaData[]
      ) => {
        // Query hooks for token accounts
        const { data: tokenAAccount } = useQuery(
          ['tokenAccount', accounts[0].pubkey],
          () => fetchTokenAccount(connection, accounts[0].pubkey)
        );

        const { data: tokenBAccount } = useQuery(
          ['tokenAccount', accounts[1].pubkey],
          () => fetchTokenAccount(connection, accounts[1].pubkey)
        );

        // Query hooks for mint info
        const { data: tokenAMintInfo } = useQuery(
          ['mintInfo', tokenAAccount?.mint],
          () => fetchMintInfo(connection, tokenAAccount?.mint),
          { enabled: !!tokenAAccount?.mint }
        );

        const { data: tokenBMintInfo } = useQuery(
          ['mintInfo', tokenBAccount?.mint],
          () => fetchMintInfo(connection, tokenBAccount?.mint),
          { enabled: !!tokenBAccount?.mint }
        );

        // Render the UI
        return (
          <div className="space-y-3">
            <div>
              <div className="font-bold">Token A:</div>
              <div>
                {tokenAAccount &&
                  tokenAMintInfo &&
                  getMintDecimalAmountFromNatural(
                    tokenAMintInfo,
                    tokenAAccount.amount
                  ).toFormat()}
              </div>
            </div>
            <div>
              <div className="font-bold">Token B:</div>
              <div>
                {tokenBAccount &&
                  tokenBMintInfo &&
                  getMintDecimalAmountFromNatural(
                    tokenBMintInfo,
                    tokenBAccount.amount
                  ).toFormat()}
              </div>
            </div>
          </div>
        );
      },
    },
  },
};
