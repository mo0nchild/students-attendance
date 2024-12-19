type GroupByResult<T> = { [key: string]: T[] }

export function groupBy<T>(array: T[], keyGetter: (item: T) => string): GroupByResult<T> {
    return array.reduce((acc, item) => {
		const key = keyGetter(item);
		if (!acc[key]) acc[key] = [];
		
		acc[key].push(item);
		return acc;
    }, {} as GroupByResult<T>);
}

export function convertToDDMM(dateTime: string) {
    const date = new Date(dateTime);

	const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
	const hour = String(date.getHours()).padStart(2, '0');
  	const minute = String(date.getMinutes()).padStart(2, '0');

    return `${day}.${month} ${hour}:${minute}`;
}