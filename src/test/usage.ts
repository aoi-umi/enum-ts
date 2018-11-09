import { Enum } from '..';

let enumDefine = {
    week: {
        sunday: 0 as 0,
    },
    status: {
        enable: '0' as '0',
        disable: '1' as '1',
    },
    statusOperate: {
        disable: 'disable'
    }
};
let enumChangeDefine = {
    status: {
        [enumDefine.status.enable]: {
            [enumDefine.status.disable]: 'change to disable',
            disable: 'change to disable by operate'
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

    //check can srcEnum change to destEnum
    let result = status.enumChangeCheck(status.enable, status.disable);
    console.log(result);
    //change to disable

    result = status.enumChangeCheck(status.enable, enumDefine.statusOperate.disable);
    console.log(result);
    //change to disable by operate

    result = status.enumChangeCheck(status.disable, status.enable);
    //throw error: 
    //status:[1](disable) can not change to [0](enable)
} catch (e) {
    console.log(e);
}