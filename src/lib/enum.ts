import { enumerable, stringFormat, error, clone } from './common';
import errorConfig from './errorConfig';

export type EnumInstanceObject<T1, T2> = {
    [P in keyof T1]: EnumInstance<T1, T1[P]> & T1[P]
} & Enum<T1, T2>;

export class EnumInstance<T1, T2> {
    readonly enumName: keyof T1;
    readonly instance: EnumInstanceObject<T1, any>;

    constructor(enumName: keyof T1, instance: EnumInstanceObject<T1, any>) {
        Object.defineProperties(this, {
            enumName: {
                enumerable: false,
                value: enumName
            },
            instance: {
                enumerable: false,
                value: instance
            }
        });

        let clo = clone(this.instance.enumDict[enumName]);
        for (let key in clo) {
            this[key as string] = clo[key];
        }
    }

    @enumerable(false)
    getAllKey() {
        return this.instance.getAllKey(this.enumName);
    }

    @enumerable(false)
    getAllValue() {
        return this.instance.getAllValue(this.enumName);
    }

    @enumerable(false)
    toArray() {
        return this.instance.toArray(this.enumName);
    }

    @enumerable(false)
    toObject() {
        return clone(this.instance.enumDict[this.enumName]);
    }

    @enumerable(false)
    toJSON() {
        return clone(this.instance.enumDict[this.enumName]);
    }

    @enumerable(false)
    getKey(value: T2[keyof T2]) {
        return this.instance.getKey(this.enumName, value as any);
    }

    @enumerable(false)
    getName(value: T2[keyof T2]) {
        return this.instance.getName(this.enumName, value as any);
    }

    @enumerable(false)
    getValue(key: keyof T2) {
        return this.instance.getValue(this.enumName, key as any);
    }

    @enumerable(false)
    enumChangeCheck(srcEnum, destEnum) {
        return this.instance.enumChangeCheck(this.enumName, srcEnum, destEnum);
    }

    @enumerable(false)
    getStateTable() {
        return this.instance.getStateTable(this.enumName);
    }
}

type EnumKey<T> = Extract<keyof T[keyof T], string>;
type EnumValue<T> = T[keyof T][EnumKey<T>];

export class Enum<T1, T2>{
    static createInstance<T1, T2>(enumDict: T1, enumChangeDict?: T2) {
        let instance: EnumInstanceObject<T1, T2> = new Enum(enumDict, enumChangeDict) as any;
        for (let enumName in enumDict) {
            instance[enumName] = new EnumInstance(enumName, instance) as any;
        }

        return instance;
    }
    constructor(public enumDict: T1, public enumChangeDict: T2 = {} as any) {

    }
    getEnum(enumName: keyof T1, notThrowError?: boolean) {
        let enumType = this.enumDict[enumName];
        if (!enumType && !notThrowError) throw error(`enum "${enumName}" not exist!`, errorConfig.ARGS_ERROR);
        return enumType;
    }
    isInEnum(enumName: keyof T1, value: EnumValue<T1>, notThrowError?: boolean) {
        return this.getKey(enumName, value, notThrowError) === null ? false : true;
    }
    getAllKey(enumName: keyof T1, notThrowError?: boolean) {
        let enumType = this.getEnum(enumName, notThrowError);
        return Object.keys(enumType);
    }

    getAllValue(enumName: keyof T1, notThrowError?: boolean) {
        let enumType = this.getEnum(enumName, notThrowError);
        return Object.values(enumType);
    }

    toArray(enumName: keyof T1, notThrowError?: boolean) {
        let enumType = this.getEnum(enumName, notThrowError);
        let list: { key: string, value: any }[] = [];
        for (let key in enumType) {
            list.push({
                key,
                value: enumType[key]
            });
        }
        return list;
    }

    getKey(enumName: keyof T1, value: EnumValue<T1>, notThrowError?: boolean) {
        let enumType = this.getEnum(enumName, notThrowError);
        for (let i in enumType) {
            if (enumType[i] == value) {
                return i;
            }
        }
        return null;
    }
    /**
     * getName = getkey
     * @param enumName 
     * @param value 
     * @param notThrowError 
     */
    getName(enumName: keyof T1, value: EnumValue<T1>, notThrowError?: boolean) {
        return this.getKey(enumName, value, notThrowError);
    }
    getValue(enumName: keyof T1, key: EnumKey<T1>, notThrowError?: boolean) {
        let enumType = this.getEnum(enumName, notThrowError);
        return enumType[key];
    }

    enumChangeCheck(enumType: keyof T1, srcEnum, destEnum) {
        if (enumType == undefined)
            throw error('enumType can not be empty!');

        let enumOperateType = enumType + 'Operate';
        let changeDict = this.enumChangeDict[enumType as any];
        if (srcEnum == undefined || srcEnum == null || destEnum == undefined || destEnum == null)
            throw error('', errorConfig.ARGS_ERROR);
        srcEnum = srcEnum.toString();
        destEnum = destEnum.toString();

        let srcEnumName = this.getName(enumType, srcEnum, true);
        let destEnumName = this.getName(enumType, destEnum, true) || this.getName(enumOperateType as any, destEnum, true);
        if (srcEnumName === null)
            throw error(stringFormat('no match src enum [{0}] in [{1}]!', srcEnum, enumType), errorConfig.CODE_ERROR);

        if (destEnumName === null)
            throw error(stringFormat('no match dest enum [{0}] in [{1}]!', destEnum, enumType), errorConfig.CODE_ERROR);

        if (!changeDict[srcEnum] || !changeDict[srcEnum][destEnum]) {
            throw error(stringFormat('{0} can not change to {1}',
                `${enumType}:` + `[${srcEnumName}](${srcEnum})`,
                `[${destEnumName}](${destEnum})`), errorConfig.ENUM_CHANGED_INVALID);
        }
        return changeDict[srcEnum][destEnum];
    }

    getStateTable(enumName: keyof T1) {
        let list = [];
        let arr = this.toArray(enumName);
        let keys = arr.map(ele => ele.key);
        list.push(['-', ...keys]);
        arr.forEach(ele => {
            let stateList: any[] = [ele.key];
            arr.forEach(ele2 => {
                let state;
                try {
                    state = this.enumChangeCheck(enumName, ele.value, ele2.value)
                } catch (e) {

                }
                stateList.push([undefined, null].includes(state) ? 0 : 1)
            });
            list.push(stateList);
        });
        return list;
    }
}