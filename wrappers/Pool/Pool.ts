import { Address, Cell, Contract, ContractProvider, Sender, SendMode, toNano } from '@ton/core';
import {
    DepositStakeParams,
    getDepositStakeMessageBody,
    getRecoverStakeMessageBody,
    getWithdrawStakeMessageBody,
    RecoverStakeParams,
    WithdrawStakeParams,
} from './utils/message-constructors';
import { PoolMember, unpackMembersFromDictionary } from './utils/member-utils';

export class Pool implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new Pool(address);
    }

    async getConfigExtra(provider: ContractProvider): Promise<ConfigExtra> {
        const result = await provider.get('get_params', []);
        return {
            Enabled: result.stack.readBoolean(),
            UpgradesEnabled: result.stack.readBoolean(),
            MinStake: result.stack.readBigNumber(),
            DepositFee: result.stack.readBigNumber(),
            WithdrawFee: result.stack.readBigNumber(),
            PoolFee: result.stack.readBigNumber(),
            ReceiptPrice: result.stack.readBigNumber(),
        };
    }

    async sendWithdrawStaked(provider: ContractProvider, via: Sender, opts: WithdrawStakeParams) {
        const PoolConfigExtra = await this.getConfigExtra(provider);
        const withdrawExactValue = PoolConfigExtra.WithdrawFee + PoolConfigExtra.ReceiptPrice;
        if (opts.value === undefined) {
            opts.value = withdrawExactValue;
        }
        if (opts.value != withdrawExactValue) {
            throw new RangeError(`sent amount must be more than stake fee (${withdrawExactValue}): ${opts.value}`);
        }
        return await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: getWithdrawStakeMessageBody(opts),
        });
    }

    async sendDepositStake(provider: ContractProvider, via: Sender, opts: DepositStakeParams) {
        const PoolConfigExtra = await this.getConfigExtra(provider);
        const depositMinValue = PoolConfigExtra.DepositFee + PoolConfigExtra.ReceiptPrice;
        if (opts.value === undefined) {
            throw new RangeError(`sent amount must be more than stake fee (${depositMinValue}): ${opts.value}`);
        }
        if (opts.value < depositMinValue) {
            throw new RangeError(`sent amount must be more than stake fee (${depositMinValue}): ${opts.value}`);
        }
        return await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: getDepositStakeMessageBody(opts),
        });
    }

    async sendRecoverStake(provider: ContractProvider, via: Sender, opts: RecoverStakeParams) {
        if (opts.value === undefined) {
            opts.value = toNano('2.0');
        }
        if (opts.value < toNano('2.0')) {
            throw new RangeError(`sent amount must be more than stake fee (${toNano('2.0')}): ${opts.value}`);
        }
        return provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: getRecoverStakeMessageBody(opts),
        });
    }

    /**
     *
     * @returns a list of all members
     * @notice does not update members' balances if there is an incoming profit or loss
     * @notice Owner's id will be returned as 0 instead of bigint address
     */
    async getMembersRaw(provider: ContractProvider): Promise<PoolMember[]> {
        const getMethodResult = await provider.get('get_members_raw', []);

        try {
            const cell = getMethodResult.stack.readCell();

            return unpackMembersFromDictionary(cell);
        } catch (e) {
            return [];
        }
    }

    /**
     *
     * @returns a list of members without: pendingWithdrawAll and profitPerCoin
     * @notice updates members' balances if there is an incoming profit or loss
     * @notice Owner's id will be returned as bigint address instead of 0
     */
    async getMembers(provider: ContractProvider): Promise<Omit<PoolMember, 'pendingWithdrawAll' | 'profitPerCoin'>[]> {
        const getMethodResult = await provider.get('get_members', []);

        const memberLispList = getMethodResult.stack.readLispList();
        const membersArray = memberLispList.map((member) => {
            if (member.type !== 'tuple') throw TypeError('Pool member should be a tuple but received: ' + member.type);

            const memberProperties = member.items;
            if (member.items.length !== 5) {
                throw new TypeError('Member should have exactly 5 properties, received: ' + member.items.length);
            }

            if (memberProperties[0].type !== 'slice') {
                throw new TypeError(
                    'Member #0 property should be of type slice, received: ' + memberProperties[0].type,
                );
            }
            const address = memberProperties[0].cell.beginParse().loadAddress();
            if (memberProperties[1].type !== 'int') {
                throw new TypeError('Member #1 property should be of type int, received: ' + memberProperties[1].type);
            }
            const balance = memberProperties[1].value;

            if (memberProperties[2].type !== 'int') {
                throw new TypeError('Member #2 property should be of type int, received: ' + memberProperties[2].type);
            }
            const pendingDeposit = memberProperties[2].value;

            if (memberProperties[3].type !== 'int') {
                throw new TypeError('Member #3 property should be of type int, received: ' + memberProperties[3].type);
            }
            const pendingWithdraw = memberProperties[3].value;

            if (memberProperties[4].type !== 'int') {
                throw new TypeError('Member #4 property should be of type int, received: ' + memberProperties[4].type);
            }
            const withdraw = memberProperties[4].value;

            return {
                id: BigInt('0x' + address.hash.toString('hex')),
                balance,
                pendingDeposit,
                pendingWithdraw,
                withdraw,
            };
        });
        return membersArray;
    }
}

export type ConfigExtra = {
    Enabled: boolean;
    UpgradesEnabled: boolean;
    MinStake: bigint;
    DepositFee: bigint;
    WithdrawFee: bigint;
    PoolFee: bigint;
    ReceiptPrice: bigint;
    value?: bigint;
    queryId?: number;
};
