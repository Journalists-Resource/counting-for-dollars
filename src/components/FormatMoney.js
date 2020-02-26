const formatMoney = (value, percentify) => {
   if (percentify === "income") {
     console.log(percentify)
     return (Math.round(value * 10000)/100) + "%"
   } else if (!isNaN(value)) {
     let newvalue = parseFloat(value);
     return "$" + newvalue.toLocaleString('en-US');
   } else {
     return value;
   }
}

export default formatMoney
