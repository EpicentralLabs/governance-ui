import DLMM from '@meteora-ag/dlmm';
import { PublicKey, Connection } from '@solana/web3.js';
import { env } from 'process';



async function setupDLMM() {
  // Get RPC URL from environment variable or use default
  let rpc = env.RPC || 'https://api.mainnet-beta.solana.com';
  const connection = new Connection(rpc);

  // Define your pool address (USDC/USDT pool in this case)
  const USDC_USDT_POOL = new PublicKey('ARwi1S4DaiTG5DX7S4M4ZsrXqpMD1MrTmbu9ue2tpmEq');
  
  // Create a single DLMM pool
  const dlmmPool = await DLMM.create(connection, USDC_USDT_POOL);
  
  // If you need to create multiple DLMM pools, use createMultiple
  // const dlmmPools = await DLMM.createMultiple(connection, [USDC_USDT_POOL, anotherPoolAddress, ...]);
  
  console.log(dlmmPool);

}

setupDLMM().catch(error => {
  console.error("Error setting up DLMM:", error);
});
