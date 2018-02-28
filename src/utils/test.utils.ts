// a patch for pretty format output that will exclude uids from storyshots
// this is because they are not constants and change on every new storyshots
// the issue with this is that we cant compare new and old storyshots
import * as prettyFormat from 'pretty-format';
import * as R from 'ramda';

export type ListWithUid = Array<{uid: string} & any>;

export interface IHasUid {
    [field: string]: {
        data: ListWithUid | any[] | any | null;
        [field: string]: any | null;
     } | any;
}

export const replaceUidInList = (data: ListWithUid): ListWithUid => {
    return data.map(obj => {
        if (obj && obj.uid) obj.uid = 'unique_id_stub';
        return obj;
    });
};

export const uidPatchForObjs = (data: IHasUid) => {
    return Object.keys(data).reduce((acc, key: string) => {
        if (data[key] && data[key].data && Array.isArray(data[key].data)) {
            const hasUID =
                R.all((obj: any) => obj.uid && obj.uid !== undefined, data[key].data);
            const newItems =
                hasUID ? replaceUidInList(data[key].data) : data[key].data;
            return {...acc, [key]: { ...data[key], data: newItems}};
        }
        return {...acc, [key]: { ...data[key]}};
    }, {});
};

export const prettyLists =
    (data: ListWithUid) => prettyFormat(replaceUidInList(data));

export const prettyDataObjs =
    (data: IHasUid) => prettyFormat(uidPatchForObjs(data));
