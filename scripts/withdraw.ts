import { NetworkProvider } from '@ton/blueprint';
import { toNano } from '@ton/core';
import { Pool } from '../wrappers/Pool/Pool';
import {POOL_ADDRESS} from "../wrappers/Pool/constants";
export async function run(provider: NetworkProvider) {
    const pool = provider.open(Pool.createFromAddress(POOL_ADDRESS));

    const PoolConfigExtra = await pool.getConfigExtra();
    
    await pool.sendWithdrawStaked(provider.sender(),
        {
            value: PoolConfigExtra.WithdrawFee + PoolConfigExtra.ReceiptPrice,
            withdrawAmount: toNano(50),
        }
    );
}
