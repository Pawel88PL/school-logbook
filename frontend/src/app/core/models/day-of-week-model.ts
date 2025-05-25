export interface DaysOfWeek {
    value: number;
    label: string;
}

export const daysOfWeek: DaysOfWeek[] = [
    { value: 1, label: 'Poniedziałek' },
    { value: 2, label: 'Wtorek' },
    { value: 3, label: 'Środa' },
    { value: 4, label: 'Czwartek' },
    { value: 5, label: 'Piątek' },
    { value: 6, label: 'Sobota' },
    { value: 0, label: 'Niedziela' }
];