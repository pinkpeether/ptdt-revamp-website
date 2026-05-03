// BEP-20 minimal ABI for PTDT token reads
export const ERC20_ABI = [
  { name:"balanceOf",  type:"function", stateMutability:"view",
    inputs:[{name:"account",type:"address"}], outputs:[{type:"uint256"}] },
  { name:"decimals",   type:"function", stateMutability:"view",
    inputs:[], outputs:[{type:"uint8"}] },
  { name:"totalSupply",type:"function", stateMutability:"view",
    inputs:[], outputs:[{type:"uint256"}] },
] as const;

// Staking contract ABI (extend when the real ABI is available)
export const STAKING_ABI = [
  { name:"stake",      type:"function", stateMutability:"nonpayable",
    inputs:[{name:"amount",type:"uint256"},{name:"tier",type:"uint8"}],
    outputs:[] },
  { name:"unstake",    type:"function", stateMutability:"nonpayable",
    inputs:[{name:"positionId",type:"uint256"}], outputs:[] },
  { name:"claimRewards",type:"function",stateMutability:"nonpayable",
    inputs:[{name:"positionId",type:"uint256"}], outputs:[] },
  { name:"getPosition",type:"function", stateMutability:"view",
    inputs:[{name:"user",type:"address"},{name:"positionId",type:"uint256"}],
    outputs:[{type:"uint256"},{type:"uint8"},{type:"uint256"},{type:"uint256"}] },
] as const;

export const PTDT_TOKEN    = import.meta.env.PUBLIC_PTDT_TOKEN_ADDRESS    as `0x${string}`;
export const STAKING_ADDR  = import.meta.env.PUBLIC_STAKING_CONTRACT_ADDRESS as `0x${string}`;
