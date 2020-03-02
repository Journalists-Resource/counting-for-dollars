const formatMoney = (value, percentify) => {
   if (percentify === "income") {
     return (Math.round(value * 1000000)/10000) + "%"
   } else if (!isNaN(value) && value<10000) {
     let newvalue = parseFloat(value);
     return (Math.round(newvalue*1000)/1000).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
   } else if (!isNaN(value)) {
     let newvalue = parseFloat(value);
     return "$" + newvalue.toLocaleString('en-US');
   } else {
     return value;
   }
}

export default formatMoney
