import { Enum } from '../lib';

let enumDefine = {
    week: {
        sunday: 0 as 0,
    },
    status: {
        enable: '0' as '0',
        disable: '1' as '1',
    },
    statusOperate: {
        disable: 'disableOp'
    }
};
let enumChangeDefine = {
    status: {
        [enumDefine.status.enable]: {
            [enumDefine.status.disable]: 'change to disable',
            [enumDefine.statusOperate.disable]: 'change to disable by operate'
        },
    }
};

let enumInst = Enum.createInstance(enumDefine, enumChangeDefine);
let { week, status } = enumInst;

console.log(`sunday is ${week.sunday}`);
//sunday is 0

try {
    console.log(week.getAllKey());
    //[ 'sunday' ]
    console.log(week.getAllValue());
    //[ 0 ]

    console.log(week.toArray());
    console.log(week.toObject());
    console.log(JSON.stringify(week));

    let stateT = status.getStateTable();
    console.log(stateT);
    /*
    state table
    [
        [ '-',       'enable', 'disable' ],
        [ 'enable',  0,        1 ],
        [ 'disable', 0,        0 ]
    ]
    */

    //check can srcEnum change to destEnum
    let result = status.enumChangeCheck(status.enable, status.disable);
    console.log(result);
    //change to disable

    result = status.enumChangeCheck(status.enable, enumDefine.statusOperate.disable);
    console.log(result);
    //change to disable by operate

    result = status.enumChangeCheck(status.disable, status.enable);
    //throw error: 
    //status:[disable](1) can not change to [enable](0)
} catch (e) {
    console.log(e);
}