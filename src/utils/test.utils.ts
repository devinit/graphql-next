// a patch for pretty format output that will exclude uids from storyshots
// this is because they are not constants and change on every new storyshots
// the issue with this is that we cant compare new and old storyshots
import * as prettyFormat from 'pretty-format';
import * as R from 'ramda';

export type ListWithUid = Array<{uid: string} & any>;

export interface IHasUid {
    [field: string]: {
        [field: string]: ListWithUid | any[] | any | null;
     } | any;
}

export const replaceUidInList = (data: ListWithUid): ListWithUid => {
    return data.map(obj => {
        if (obj && obj.uid) obj.uid = 'unique_id_stub';
        return obj;
    });
};

export const uidPatchForObjs = (data: IHasUid, field: string = 'data') => {
    return Object.keys(data).reduce((acc, key: string) => {
        if (data[key] && data[key][field] && Array.isArray(data[key][field])) {
            const dataWithUID = data[key][field];
            const hasUID =
                R.all((obj: any) => obj.uid && obj.uid !== undefined,  dataWithUID);
            const newItems =
                hasUID ? replaceUidInList( dataWithUID) :  dataWithUID;
            return {...acc, [key]: { ...data[key], data: newItems}};
        }
        return {...acc, [key]: { ...data[key]}};
    }, {});
};

export const prettyLists =
    (data: ListWithUid) => prettyFormat(replaceUidInList(data));

export const prettyDataObjs =
    (data: IHasUid) => prettyFormat(uidPatchForObjs(data));

export const prettyListMany = (data: ListWithUid[]) => {
 const result =  R.map((item: ListWithUid) => replaceUidInList(item), data);
 return prettyFormat(result);
};
