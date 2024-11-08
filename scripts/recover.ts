import { NetworkProvider } from '@ton/blueprint';
import { Pool } from '../wrappers/Pool/Pool';
import { POOL_ADDRESS } from '../wrappers/Pool/constants';
import { toNano } from '@ton/core';

export async function run(provider: NetworkProvider) {
    const pool = provider.open(Pool.createFromAddress(POOL_ADDRESS));

    await pool.sendRecoverStake(provider.sender(), {
        value: toNano('2.0'),
        queryId: Date.now(),
    });
}
