import { Address, beginCell, Builder, Cell, Dictionary, Slice } from '@ton/core';

export type PoolMember = {
    id: bigint;
    balance: bigint;
    pendingWithdraw: bigint;
    pendingWithdrawAll: boolean;
    pendingDeposit: bigint;
    profitPerCoin: bigint;
    withdraw: bigint;
};

export function packMemberIdsIntoDictionary(ids: bigint[]): Dictionary<bigint, Cell> {
    const dictionary = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());
    ids.forEach((id) => {
        dictionary.set(id, beginCell().endCell());
    });
    return dictionary;
}

export const serializeMember = (member: PoolMember, builder: Builder) => {
    builder
        .storeInt(member.profitPerCoin, 128)
        .storeCoins(member.balance)
        .storeCoins(member.pendingWithdraw)
        .storeBit(member.pendingWithdrawAll)
        .storeCoins(member.pendingDeposit)
        .storeCoins(member.withdraw);
};

export const parseMemberFromSlice = (slice: Slice): Omit<PoolMember, 'id'> => {
    return {
        profitPerCoin: slice.loadIntBig(128),
        balance: slice.loadCoins(),
        pendingWithdraw: slice.loadCoins(),
        pendingWithdrawAll: slice.loadBoolean(),
        pendingDeposit: slice.loadCoins(),
        withdraw: slice.loadCoins(),
    };
};

export function unpackMembersFromDictionary(cell: Cell): (PoolMember & { address: Address })[] {
    const result: (PoolMember & { address: Address })[] = [];
    const dictionary = cell.beginParse().loadDictDirect(Dictionary.Keys.BigUint(256), {
        serialize: serializeMember,
        parse: parseMemberFromSlice,
    });
    const keys = dictionary.keys();
    const values = dictionary.values();

    for (let i = 0; i < keys.length; i++) {
        const member = values[i];
        result.push({ ...member, id: keys[i], address: Address.parseRaw('0:' + keys[i].toString(16)) });
    }
    return result;
}
