import { NetworkProvider } from '@ton/blueprint';
import { Pool } from '../wrappers/Pool/Pool';
import { AMOUNT_WITHDRAW, POOL_ADDRESS } from '../wrappers/Pool/constants';
export async function run(provider: NetworkProvider) {
    const pool = provider.open(Pool.createFromAddress(POOL_ADDRESS));

    const poolParameters = await pool.getConfigExtra();

    await pool.sendWithdrawStaked(provider.sender(), {
        value: poolParameters.WithdrawFee + poolParameters.ReceiptPrice,
        withdrawAmount: AMOUNT_WITHDRAW,
    });
}
