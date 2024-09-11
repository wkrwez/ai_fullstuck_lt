import { ReactNode } from 'react';
import { TextItemType } from '@/src/store/input'
import { PresetsItem } from '@/src/store/config';

export interface TurnItem {
    id?: string;
    key?: string;
    label: string;
    children?: ReactNode;
}

export interface TurnData {
    label: string;
    key: string;
    list: TurnItem[];
}

export interface TurnProps {
    list: PresetsItem[];
    category?: string;
    value?: string;
    // value?: string;
    // onChange: (item: TurnItem) => void
}

export interface StyleItem {
    top: number,
    left: number,
    textDeg: number,
    rotate: number
}