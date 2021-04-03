export default function dateFilter(value,format='date'){
  let options={
    
  };
 if (format.includes('month')){
  options.month='long';
 }
 if (format.includes('year')){
  options.year='numeric';
 }
 
  
  return new Intl.DateTimeFormat('ru-RU', options).format(new Date(value));
}
