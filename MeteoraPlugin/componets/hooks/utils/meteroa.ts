import DLMM from '@meteora-ag/dlmm'
// You can get your desired pool address from the API https://dlmm-api.meteora.ag/pair/all

const USDC_USDT_POOL = new PublicKey('ARwi1S4DaiTG5DX7S4M4ZsrXqpMD1MrTmbu9ue2tpmEq') 
const dlmmPool = await DLMM.create(connection, USDC_USDT_POOL);

// If you need to create multiple, can consider using `createMultiple`
const dlmmPool = await DLMM.createMultiple(connection, [USDC_USDT_POOL, ...]);