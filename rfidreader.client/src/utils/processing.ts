type GroupByResult<T> = { [key: string]: T[] }

export function groupBy<T>(array: T[], keyGetter: (item: T) => string): GroupByResult<T> {
    return array.reduce((acc, item) => {
      const key = keyGetter(item);
      if (!acc[key]) acc[key] = [];
      
      acc[key].push(item);
      return acc;
    }, {} as GroupByResult<T>);
  }